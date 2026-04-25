const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageKit');
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/events
// @desc    Create an event
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { title, type, startDateTime, endDateTime, address, locationLat, locationLng, garden_id, description, entryFee } = req.body;
    
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImage(file.buffer, file.originalname));
      imageUrls = await Promise.all(uploadPromises);
    }

    const newEvent = new Event({
      title,
      type,
      startDateTime,
      endDateTime,
      address,
      images: imageUrls,
      location: {
        type: 'Point',
        coordinates: [parseFloat(locationLng), parseFloat(locationLat)]
      },
      garden_id: garden_id || null,
      creator: req.user._id,
      description,
      entryFee: parseFloat(entryFee) || 0
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/events/my
// @desc    Get user's hosted events
router.get('/my', protect, async (req, res) => {
  try {
    const events = await Event.find({ creator: req.user._id })
      .populate('attendees', 'name email profilePicture')
      .sort({ startDateTime: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update an event
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const event = await Event.findById(id = req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creator.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

    const { title, type, startDateTime, endDateTime, address, description, entryFee } = req.body;
    
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImage(file.buffer, file.originalname));
      event.images = await Promise.all(uploadPromises);
    }

    event.title = title || event.title;
    event.type = type || event.type;
    event.startDateTime = startDateTime || event.startDateTime;
    event.endDateTime = endDateTime || event.endDateTime;
    event.address = address || event.address;
    event.description = description || event.description;
    event.entryFee = entryFee !== undefined ? parseFloat(entryFee) : event.entryFee;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creator.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Unauthorized' });

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/events/:id/join
// @desc    Join an event
router.post('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined' });
    }

    event.attendees.push(req.user._id);
    await event.save();
    res.json({ message: 'Joined successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/events
// @desc    Get nearby events (20km radius)
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    let query = {};
    if (lat && lng) {
      query.location = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 20000
        }
      };
    }

    const events = await Event.find(query).populate('garden_id', 'name').populate('creator', 'name profilePicture');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

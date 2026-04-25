const express = require('express');
const router = express.Router();
const Garden = require('../models/Garden');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageKit');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/gardens
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { name, type, lat, lng, address, phone, openingTime, closingTime, entryFee, description } = req.body;
    
    // Upload images to ImageKit
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        imageUrls.push(url);
      }
    }

    const newGarden = new Garden({
      name,
      type,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      address,
      phone,
      openingTime,
      closingTime,
      entryFee: parseFloat(entryFee) || 0,
      description,
      images: imageUrls,
      owner: req.user._id
    });

    const savedGarden = await newGarden.save();
    res.status(201).json(savedGarden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gardens
// @desc    Get nearby gardens (20km radius)
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
          $maxDistance: 20000 // 20km in meters
        }
      };
    }

    const gardens = await Garden.find(query).populate('owner', 'name profilePicture');
    res.json(gardens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/gardens/:id
// @desc    Get garden details
router.get('/:id', async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id).populate('owner', 'name email profilePicture phone');
    if (!garden) return res.status(404).json({ message: 'Garden not found' });
    res.json(garden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/gardens/:id
// @desc    Update garden details
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    let garden = await Garden.findById(req.params.id);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });
    if (garden.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, type, description, address, phone, openingTime, closingTime, entryFee } = req.body;
    
    if (name) garden.name = name;
    if (type) garden.type = type;
    if (description) garden.description = description;
    if (address) garden.address = address;
    if (phone) garden.phone = phone;
    if (openingTime) garden.openingTime = openingTime;
    if (closingTime) garden.closingTime = closingTime;
    if (entryFee !== undefined) garden.entryFee = parseFloat(entryFee);
    
    // Handle new images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        garden.images.push(url);
      }
    }

    const updatedGarden = await garden.save();
    res.json(updatedGarden);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/gardens/:id/reviews
// @desc    Add a review to a garden
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const garden = await Garden.findById(req.params.id);

    if (!garden) return res.status(404).json({ message: 'Garden not found' });

    // Check if user already reviewed
    const alreadyReviewed = garden.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this garden' });

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    garden.reviews.push(review);
    garden.ratingsQuantity = garden.reviews.length;
    garden.ratingsAverage = garden.reviews.reduce((acc, item) => item.rating + acc, 0) / garden.reviews.length;

    await garden.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/gardens/:id
// @desc    Delete a garden (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const garden = await Garden.findById(req.params.id);
    if (!garden) return res.status(404).json({ message: 'Garden not found' });
    if (garden.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this garden' });
    }
    await Garden.findByIdAndDelete(req.params.id);
    res.json({ message: 'Garden deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

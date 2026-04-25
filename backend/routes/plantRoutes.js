const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageKit');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/plants
// @desc    Add plant for sale
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { name, price, description, gardenId } = req.body;
    
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        imageUrls.push(url);
      }
    }

    const newPlant = new Plant({
      name,
      price,
      description,
      images: imageUrls,
      seller: req.user._id,
      garden: gardenId || null
    });

    const savedPlant = await newPlant.save();
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/plants/my
// @desc    Get user's plant listings
router.get('/my', protect, async (req, res) => {
  try {
    const Request = require('../models/Request');
    const plants = await Plant.find({ seller: req.user._id }).populate('garden', 'name');
    
    // For each plant, find how many people contacted (requests)
    const plantsWithCounts = await Promise.all(plants.map(async (plant) => {
      const contactCount = await Request.countDocuments({ 
        targetId: plant._id, 
        targetModel: 'Plant',
        type: 'Plant Purchase'
      });
      return { ...plant._doc, contactCount };
    }));

    res.json(plantsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/plants
// @desc    Get all plants for sale
router.get('/', async (req, res) => {
  try {
    const plants = await Plant.find().populate('seller', 'name profilePicture phone').populate('garden', 'name');
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/plants/:id
// @desc    Update plant listing
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    let plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    if (plant.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, price, description, inStock } = req.body;
    
    if (name) plant.name = name;
    if (price) plant.price = price;
    if (description) plant.description = description;
    if (inStock !== undefined) plant.inStock = inStock;
    
    if (req.files && req.files.length > 0) {
      // Migrate legacy image to array if it's the first time adding to the gallery
      if (plant.image && (!plant.images || plant.images.length === 0)) {
        plant.images.push(plant.image);
      }
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        plant.images.push(url);
      }
    }

    const updatedPlant = await plant.save();
    res.json(updatedPlant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/plants/:id
// @desc    Delete plant listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    if (plant.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await plant.deleteOne();
    res.json({ message: 'Plant removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

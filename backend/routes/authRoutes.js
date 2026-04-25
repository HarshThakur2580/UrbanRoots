const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageKit');

const upload = multer({ storage: multer.memoryStorage() });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name, email, password: hashedPassword, location
    });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, location: user.location, phone: user.phone, role: user.role, profilePicture: user.profilePicture, token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, location: user.location, phone: user.phone, role: user.role, profilePicture: user.profilePicture, token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user profile (always fresh from DB)
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent any browser caching of profile data
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/upload-avatar
// @desc    Upload profile picture (POST so multer works reliably in Express 5)
router.post('/upload-avatar', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Avatar upload received:', req.file.originalname, req.file.size, 'bytes');
    const url = await uploadImage(req.file.buffer, req.file.originalname);
    console.log('Avatar ImageKit URL:', url);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePicture: url } },
      { returnDocument: 'after', runValidators: false }
    ).select('-password');

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    console.error('Avatar upload error:', error.message);
    res.status(500).json({ message: 'Image upload failed: ' + error.message });
  }
});

// @route   PUT /api/auth/me
// @desc    Update profile text fields (name, location, phone, password) — no file handling
router.put('/me', protect, async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.name)     updateFields.name     = req.body.name;
    if (req.body.location) updateFields.location = req.body.location;
    if (req.body.phone)    updateFields.phone    = req.body.phone;

    // Allow explicit profilePicture URL to be set (sent as text after avatar upload)
    if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: false }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: error.message });
  }

});

module.exports = router;

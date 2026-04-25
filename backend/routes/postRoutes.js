const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const { uploadImage } = require('../utils/imageKit');

const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/posts
router.post('/', protect, upload.array('media', 5), async (req, res) => {
  try {
    const { content, lat, lng } = req.body;
    const mediaUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        mediaUrls.push(url);
      }
    }
    const postFields = { content, creator: req.user._id, media: mediaUrls };
    if (lat && lng) {
      postFields.location = { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] };
    }
    const newPost = new Post(postFields);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts/my
// @desc    Get logged-in user's own posts
router.get('/my', protect, async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.user._id })
      .populate('creator', 'name profilePicture email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/posts
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let query = {};
    if (lat && lng) {
      query.location = {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 20000
        }
      };
    }
    const posts = await Post.find(query).populate('creator', 'name profilePicture').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/posts/:id  (owner only)
router.put('/:id', protect, upload.array('media', 5), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });

    if (req.body.content) post.content = req.body.content;

    // Handle deletions
    if (req.body.deleteIndices) {
      const indices = JSON.parse(req.body.deleteIndices); // Array of indices to remove
      post.media = post.media.filter((_, index) => !indices.includes(index));
    }

    // Handle new uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadImage(file.buffer, file.originalname);
        post.media.push(url);
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/posts/:id  (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.creator.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorised' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/posts/:id/comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, text });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

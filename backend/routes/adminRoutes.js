const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const sendEmail = require('../utils/email');

const User = require('../models/User');
const Garden = require('../models/Garden');
const Post = require('../models/Post');
const Plant = require('../models/Plant');
const Event = require('../models/Event');

// @route   GET /api/admin/dashboard
// @desc    Get all platform data for admin overview
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    const gardens = await Garden.find({}).populate('owner', 'name email').sort({ createdAt: -1 });
    const posts = await Post.find({}).populate('creator', 'name email').sort({ createdAt: -1 });
    const plants = await Plant.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
    const events = await Event.find({}).populate('creator', 'name email').sort({ createdAt: -1 });

    res.json({
      users,
      gardens,
      posts,
      plants,
      events
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/admin/delete/:type/:id
// @desc    Delete a resource and send reason to owner
// @access  Private/Admin
router.delete('/delete/:type/:id', protect, admin, async (req, res) => {
  try {
    const { type, id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'A reason must be provided for deletion.' });
    }

    let ownerEmail = null;
    let ownerName = null;
    let resourceTitle = '';

    switch (type) {
      case 'post':
        const post = await Post.findById(id).populate('creator', 'name email');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        ownerEmail = post.creator?.email;
        ownerName = post.creator?.name;
        resourceTitle = 'Community Post';
        await Post.findByIdAndDelete(id);
        break;

      case 'garden':
        const garden = await Garden.findById(id).populate('owner', 'name email');
        if (!garden) return res.status(404).json({ message: 'Garden not found' });
        ownerEmail = garden.owner?.email;
        ownerName = garden.owner?.name;
        resourceTitle = `Garden: "${garden.name}"`;
        await Garden.findByIdAndDelete(id);
        break;

      case 'plant':
        const plant = await Plant.findById(id).populate('seller', 'name email');
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        ownerEmail = plant.seller?.email;
        ownerName = plant.seller?.name;
        resourceTitle = `Marketplace Item: "${plant.name}"`;
        await Plant.findByIdAndDelete(id);
        break;

      case 'event':
        const event = await Event.findById(id).populate('creator', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        ownerEmail = event.creator?.email;
        ownerName = event.creator?.name;
        resourceTitle = `Event: "${event.title}"`;
        await Event.findByIdAndDelete(id);
        break;

      default:
        return res.status(400).json({ message: 'Invalid resource type' });
    }

    // Send email notification to the user if email exists
    if (ownerEmail) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #e11d48;">Content Removal Notice</h2>
          <p>Hello ${ownerName || 'UrbanRoots Member'},</p>
          <p>We are writing to inform you that your content (<strong>${resourceTitle}</strong>) has been removed from the UrbanRoots platform by a moderator.</p>
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #e11d48; margin: 20px 0;">
            <strong>Reason provided by Admin:</strong><br>
            ${reason}
          </div>
          <p>If you believe this was an error, please reply to this email to contact support.</p>
          <p>Regards,<br><strong>UrbanRoots Admin Team</strong> 🌱</p>
        </div>
      `;

      try {
        await sendEmail({
          email: ownerEmail,
          subject: 'UrbanRoots - Content Removal Notice',
          html: emailHtml
        });
      } catch (err) {
        console.error('Failed to send admin deletion email:', err.message);
        // We still return success since the resource was deleted
      }
    }

    res.json({ message: `${type} deleted successfully and owner notified.` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

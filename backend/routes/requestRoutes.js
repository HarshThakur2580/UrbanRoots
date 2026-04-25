const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/email');

// @route   POST /api/requests
// @desc    Send a request to join garden or buy plant
router.post('/', protect, async (req, res) => {
  try {
    const { type, targetId, targetModel, ownerId } = req.body;

    const request = new Request({
      type,
      targetId,
      targetModel,
      ownerId,
      requester: req.user._id
    });

    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/requests/:id/status
// @desc    Accept/Reject request & send Nodemailer email
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id).populate('requester', 'email name');

    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'Approved' || status === 'Rejected') {
      try {
        const isApproved = status === 'Approved';
        const emoji = isApproved ? '🎉' : '😔';
        const color = isApproved ? '#10b981' : '#ef4444';
        const actionText = isApproved
          ? 'You can now visit the garden and start participating in the community!'
          : 'You are welcome to explore other gardens on UrbanRoots.';

        await sendEmail({
          email: request.requester.email,
          subject: `${emoji} UrbanRoots: Your request has been ${status}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; border-radius: 16px; overflow: hidden;">
              <div style="background: ${color}; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">${emoji} Request ${status}!</h1>
              </div>
              <div style="padding: 32px;">
                <p style="font-size: 16px;">Hi <strong>${request.requester.name}</strong>,</p>
                <p style="font-size: 15px; color: #cbd5e1;">Your <strong>${request.type}</strong> request on <strong>UrbanRoots</strong> has been <span style="color: ${color}; font-weight: bold;">${status}</span> by the garden owner.</p>
                <p style="font-size: 14px; color: #94a3b8;">${actionText}</p>
                <div style="margin: 32px 0; text-align: center;">
                  <a href="http://localhost:5500/frontend/gardens.html" style="background: ${color}; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Visit UrbanRoots</a>
                </div>
                <p style="color: #64748b; font-size: 13px;">Best regards,<br>The UrbanRoots Team 🌿</p>
              </div>
            </div>
          `
        });
        console.log(`Email sent to ${request.requester.email} for status: ${status}`);
      } catch (err) {
        console.error('Email could not be sent:', err.message);
      }
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/requests
// @desc    Get all requests (incoming & outgoing) for the user
router.get('/', protect, async (req, res) => {
  try {
    // Find requests where the user is either the owner (incoming) or the requester (outgoing)
    const requests = await Request.find({
      $or: [{ ownerId: req.user._id }, { requester: req.user._id }]
    })
      .populate('requester', 'name email profilePicture')
      .populate('targetId', 'name')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Plant Purchase', 'Join Garden'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // Could be Plant ID or Garden ID
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    required: true,
    enum: ['Plant', 'Garden']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);

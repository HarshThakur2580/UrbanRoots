const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  garden: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Garden',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent multiple reviews from same user on same garden
ReviewSchema.index({ garden: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);

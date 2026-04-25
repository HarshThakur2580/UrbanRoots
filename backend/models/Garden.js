const mongoose = require('mongoose');

const GardenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Rooftop', 'Balcony', 'Community Garden', 'Backyard', 'Other'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: String,
  phone: String,
  openingTime: String,
  closingTime: String,
  entryFee: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
  },
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Create geospatial index
GardenSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Garden', GardenSchema);

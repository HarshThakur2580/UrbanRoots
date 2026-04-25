const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff'
  },
  location: {
    type: String,
  },
  phone: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

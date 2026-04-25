const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Garden = require('./models/Garden');
const Post = require('./models/Post');
const Plant = require('./models/Plant');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    try {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      console.log('Users:', users.length);
      const gardens = await Garden.find({}).populate('owner', 'name email').sort({ createdAt: -1 });
      console.log('Gardens:', gardens.length);
      const posts = await Post.find({}).populate('creator', 'name email').sort({ createdAt: -1 });
      console.log('Posts:', posts.length);
      const plants = await Plant.find({}).populate('seller', 'name email').sort({ createdAt: -1 });
      console.log('Plants:', plants.length);
      const events = await Event.find({}).populate('creator', 'name email').sort({ createdAt: -1 });
      console.log('Events:', events.length);
      console.log('SUCCESS');
    } catch (e) {
      console.error('ERROR:', e.message);
    }
    process.exit(0);
  });

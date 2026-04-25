const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const adminUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminUser) throw new Error('Admin not found');
      
      const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      
      const res = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Response body:', text.substring(0, 500) + '...');
      
      if (res.ok) {
        const data = JSON.parse(text);
        console.log('Users:', data.users?.length);
        console.log('Gardens:', data.gardens?.length);
        console.log('Posts:', data.posts?.length);
      }
    } catch (e) {
      console.error('ERROR:', e.message);
    }
    process.exit(0);
  });

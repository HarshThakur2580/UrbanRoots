const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serverless-friendly DB Connection Middleware
let isConnected = false;

app.use(async (req, res, next) => {
  if (isConnected) {
    return next();
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urbanroots');
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected...');
    
    // Seed Admin User (only needs to run once)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const User = require('./models/User');
      const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminExists) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        
        await User.create({
          name: 'Super Admin',
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          location: 'Global Headquarters'
        });
        console.log('Admin user ensured from .env credentials.');
      }
    }
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({ message: 'Database connection failed. Please check your connection string and ensure IP access is allowed in MongoDB Atlas.' });
  }
});


// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gardens', require('./routes/gardenRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/plants', require('./routes/plantRoutes'));
app.use('/api/bot', require('./routes/botRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
 
 

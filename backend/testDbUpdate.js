require('dotenv').config();
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = model('User', new Schema({ name: String, profilePicture: String }, { strict: false }));
  
  const testUrl = 'https://ik.imagekit.io/khyaaotbx/urbanroots/WhatsApp_Image_2025-08-29_at_22.16.30_b1ff3547_S_cklx7MDS.jpg';
  
  const updated = await User.findOneAndUpdate(
    { name: 'Ashish' },
    { $set: { profilePicture: testUrl } },
    { new: true }
  );
  
  console.log('After DB update:', updated.profilePicture);
  console.log('Test passed - findByIdAndUpdate works!');
  process.exit();
});

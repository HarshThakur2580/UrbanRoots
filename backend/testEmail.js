require('dotenv').config();
const sendEmail = require('./utils/email');
sendEmail({
  email: process.env.EMAIL_USERNAME,
  subject: 'UrbanRoots Test Email',
  html: '<h2>Test!</h2><p>Gmail SMTP working!</p>'
}).then(() => console.log('Email sent successfully!'))
  .catch(err => console.error('Failed:', err.message));

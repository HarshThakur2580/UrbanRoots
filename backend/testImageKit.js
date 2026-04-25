// Test: Simulate uploading a profile picture via the API
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

// We'll test the ImageKit upload directly first
const { uploadImage } = require('./utils/imageKit');

// Create a small test image buffer (1x1 pixel PNG)
const testBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

console.log('Testing ImageKit upload...');
uploadImage(testBuffer, 'test-profile-pic.png')
  .then(url => {
    console.log('✅ ImageKit upload SUCCESS!');
    console.log('URL:', url);
  })
  .catch(err => {
    console.error('❌ ImageKit upload FAILED:', err.message);
    console.error('Full error:', err);
  });

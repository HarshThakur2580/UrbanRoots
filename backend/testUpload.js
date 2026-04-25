// Test the NEW POST /api/auth/upload-avatar endpoint
require('dotenv').config();
const FormData = require('form-data');
const http = require('http');

async function main() {
  console.log('=== Avatar Upload Endpoint Test ===\n');

  // Step 1: Login
  console.log('1. Logging in...');
  const loginBody = JSON.stringify({ email: 'ashish123@gmail.com', password: '123456' });
  
  const loginRes = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost', port: 5000,
      path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(loginBody);
    req.end();
  });

  if (loginRes.status !== 200) {
    console.error('❌ Login failed:', loginRes.body);
    return;
  }
  const token = loginRes.body.token;
  console.log('   ✅ Logged in as:', loginRes.body.name);
  console.log('   Current pic:', loginRes.body.profilePicture?.substring(0, 60));

  // Step 2: Test NEW POST /api/auth/upload-avatar
  console.log('\n2. Testing POST /api/auth/upload-avatar...');
  const form = new FormData();
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  form.append('profilePicture', testImageBuffer, { filename: 'test-new-avatar.png', contentType: 'image/png' });

  const uploadRes = await new Promise((resolve, reject) => {
    const headers = { ...form.getHeaders(), 'Authorization': `Bearer ${token}` };
    const req = http.request({
      hostname: 'localhost', port: 5000,
      path: '/api/auth/upload-avatar',
      method: 'POST',
      headers
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });

  console.log('   HTTP Status:', uploadRes.status);
  if (uploadRes.status === 200) {
    console.log('   ✅ SUCCESS! New profilePicture:', uploadRes.body.profilePicture?.substring(0, 80));
  } else if (uploadRes.status === 404) {
    console.log('   ❌ 404 - Backend NOT restarted! Run: npm run dev');
  } else {
    console.log('   ❌ FAILED:', uploadRes.body);
  }
}

main().catch(console.error);

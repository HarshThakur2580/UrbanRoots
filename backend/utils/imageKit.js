const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/yours'
});

const uploadImage = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    imagekit.upload({
      file: buffer, // required
      fileName: fileName, // required
      folder: '/urbanroots'
    }, function(error, result) {
      if(error) reject(error);
      else resolve(result.url);
    });
  });
};

module.exports = { uploadImage };

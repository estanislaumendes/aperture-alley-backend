const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png', 'gif', 'jpeg', 'webp'],
    folder: 'aperture-alley/cameras', //name of folder in cloudinary website
  },
});

/* const usersStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png', 'gif', 'jpeg'],
    folder: 'aperture-alley/users', //name of folder in cloudinary website
  },
}); */

module.exports = multer({ storage });

const router = require('express').Router();
const Camera = require('../models/Camera.model');
const mongoose = require('mongoose');
const User = require('../models/User.model');

// Create a camera
router.post('/cameras', async (req, res, next) => {
  const {
    brand,
    name,
    format,
    model,
    price,
    condition,
    img,
    whatsIncluded,
    isSelling,
    wasSold,
    location,
    userId,
  } = req.body;

  try {
    const newCamera = await Camera.create({
      brand,
      name,
      format,
      model,
      price,
      condition,
      img,
      whatsIncluded,

      isSelling,
      wasSold,
      location,
      user: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { cameras: newCamera._id },
    });
    res.status(201).json(newCamera);
  } catch (err) {
    console.log('An error ocurred creating the camera', err);
    next(err);
  }
});

// Get all cameras
router.get('/', async (req, res, next) => {
  try {
    const allCameras = await Camera.find({});
    res.json(allCameras);
  } catch (err) {
    console.log('An error ocurred getting all cameras', err);
    next(err);
  }
});

// Get a single camera
router.get('/:id', getCamera, (req, res) => {
  res.json(res.camera);
});

// Update a camera
router.put('/:id', getCamera, async (req, res, next) => {
  const { id } = req.params;
  const {
    brand,
    name,
    format,
    model,
    price,
    condition,
    img,
    whatsIncluded,

    isSelling,
    wasSold,
    location,
    user,
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const updatedCamera = await Camera.fin;
    res.json(updatedCamera);
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
});

// Delete a camera
router.delete('/:id', getCamera, async (req, res) => {
  try {
    await res.camera.remove();
    res.json({ message: 'Deleted Camera' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCamera(req, res, next) {
  let camera;
  try {
    camera = await Camera.findById(req.params.id);
    if (camera == null) {
      return res.status(404).json({ message: 'Cannot find camera' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.camera = camera;
  next();
}

module.exports = router;

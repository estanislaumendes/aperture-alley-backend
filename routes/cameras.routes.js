const router = require('express').Router();
const Camera = require('../models/Camera.model');
const mongoose = require('mongoose');
const User = require('../models/User.model');
const fileUploader = require('../config/cloudinary.config');

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
    user,
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
      user,
    });

    console.log('New camera created:', newCamera);

    console.log('userID', user);

    const updatedUser = await User.findByIdAndUpdate(user, {
      $push: { cameras: newCamera._id },
    });

    console.log('User updated:', updatedUser);

    res.status(201).json(newCamera);
  } catch (err) {
    console.log(
      'An error occurred creating the camera or updating the user:',
      err
    );
    next(err);
  }
});

// Get all cameras
router.get('/cameras', async (req, res, next) => {
  try {
    const allCameras = await Camera.find({}).sort({ createdAt: -1 });
    res.json(allCameras);
  } catch (err) {
    console.log('An error ocurred getting all cameras', err);
    next(err);
  }
});

// Get a single camera
/* router.get('/cameras/:id', getCamera, (req, res) => {
  res.json(res.camera);
}); */

//get Cameras by ID
router.get('/cameras/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const camera = await Camera.findById(id);

    if (!camera) {
      return res.status(404).json({ message: 'No camera found' });
    }

    res.json(camera);
  } catch (error) {
    console.log('An error ocurred getting camera', error);
    next(error);
  }
});

// GET route to retrieve cameras for a specific user
router.get('/cameras/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find cameras belonging to the specified user
    const cameras = await Camera.find({ user: userId }).sort({ createdAt: -1 });

    if (!cameras) {
      return res
        .status(404)
        .json({ message: 'Cameras not found for this user' });
    }

    res.status(200).json(cameras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update a camera
/* router.put('/cameras/:id', getCamera, async (req, res, next) => {
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
    const updatedCamera = await Camera.findById(id);
    res.json(updatedCamera);
  } catch (err) {
    res.status(400).json({ message: err.message });
    next(err);
  }
}); */

//Update a camara

router.put('/cameras/:id', async (req, res, next) => {
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
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    const updatedCamera = await Camera.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!updatedCamera) {
      return res.status(404).json({ message: 'No camera found' });
    }

    res.json(updatedCamera);
  } catch (error) {
    console.log('An error ocurred updating camera', error);
    next(error);
  }
});

// Delete a camera
/* router.delete('/cameras/:id', getCamera, async (req, res) => {
  try {
    await res.camera.remove();
    res.json({ message: 'Deleted Camera' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); */

//Delete a camera

router.delete('/cameras/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }
    await Camera.findByIdAndDelete(id);

    await User.deleteMany({ camera: id });

    res.json({ message: 'Camera deleted sucessfuly' });
  } catch (error) {
    console.log('An error ocurred deleting camera', error);
    next(error);
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

//upload 5 camera images

router.post('/upload', fileUploader.array('files', 5), (req, res, next) => {
  try {
    const paths = req.files.map(file => file.path);
    res.status(200).json({ img: paths });
  } catch (error) {
    console.log('An error occurred uploading the images', error);
    res.status(400).json({ message: 'An error occurred' });
  }
});

module.exports = router;

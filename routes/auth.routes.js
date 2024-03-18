const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');

const saltRounds = 10;

router.post('/signup', async (req, res, next) => {
  const { firstName, lastName, email, password, phoneNr, cameras } = req.body;

  try {
    if (
      email === '' ||
      password === '' ||
      firstName === '' ||
      lastName === '' ||
      phoneNr === ''
    ) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    const emailRegex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Provide a valid email' });
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;

    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     message:
    //       'Password must have have a least 6 characters and contain one number, one lowercase, one uppercase and special character!',
    //   });
    // }
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided e-mail is already registered' });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //create the user

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNr,
      password: hashedPassword,
      cameras: [],
    });

    //returning the user without the hashedPassword
    res.json({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNr: newUser.phoneNr,
      _id: newUser._id,
    });
  } catch (error) {
    console.log('Error: ', error);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: 'The provided e-mail is not registered' });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    if (isPasswordCorrect) {
      //create a payload for the JWT with the user info
      //DO NOT SEND THE HASHED PASSWORD
      const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNr: user.phoneNr,
      };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });

      res.status(200).json({ authToken });
    } else {
      return res
        .status(401)
        .json({ message: 'Unable to authenticate the user' });
    }
  } catch (error) {
    console.log('An error occurred login in the user', error);
    next(error);
  }
});

router.get('/verify', isAuthenticated, (req, res, next) => {
  // if the payload needs to be verified
  if (!req.payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = req.header('Authorization').replace('Bearer ', ''); // Assuming JWT is sent in the Authorization header

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // JWT verification successful, decoded contains the payload
    console.log('Decoded JWT payload:', decoded);

    // You can access the payload in req.payload
    console.log('req.payload', req.payload);

    res.json(req.payload);
  });
});

module.exports = router;

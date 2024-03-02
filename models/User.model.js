const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is required.'],
      lowercase: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last Name is required.'],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    phoneNr: {
      type: String,
      unique: [true, 'This number is already registered'],
    },

    cameras: [{ type: Schema.Types.ObjectId, ref: 'Camera' }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;

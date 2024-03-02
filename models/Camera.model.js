const { Schema, model } = require('mongoose');

const cameraSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
      enum: ['APS-C', 'Full frame'],
    },

    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: ['Like new', 'Excellent', 'Good', 'Well used', 'Heavily used'],
    },
    img: [String],
    whatsIncluded: String,
    isSelling: Boolean,
    wasSold: Boolean,
    location: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model('Camera', cameraSchema);

const { Schema, model } = require('mongoose');

const locationsEnum = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Ilha da Graciosa',
  'Ilha da Madeira',
  'Ilha das Flores',
  'Ilha de Porto Santo',
  'Ilha de Santa Maria',
  'Ilha de São Jorge',
  'Ilha de São Miguel',
  'Ilha do Corvo',
  'Ilha do Faial',
  'Ilha do Pico',
  'Ilha Terceira',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
];

const cameraSchema = new Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      enum: [
        'ARRI',
        'Blackmagic Design',
        'Canon',
        'DJI',
        'Fujifilm',
        'GoPro',
        'Hasselblad',
        'Leica',
        'Nikon',
        'Olympus',
        'Panasonic',
        'Pentax',
        'Phase One',
        'RED',
        'Ricoh',
        'Sigma',
        'Sony',
      ],
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
    location: {
      type: String,
      enum: locationsEnum,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
const Camera = model('Camera', cameraSchema);
module.exports = Camera;

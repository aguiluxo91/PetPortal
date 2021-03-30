const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
    name: {
        type: String,
        required: 'A pet name is required'
    },
    image: {
        type: String,
        required: 'Image is required',
        validate: {
          validator: function (value) {
            try {
              const url = new URL(value);
              return url.protocol === 'http:' || url.protocol === 'https:'
            } catch(error) {
              return false;
            }
          },
          message: props => `Invalid image URL`
        }
      },
      species: {
          type: String,
          required: 'Your pet species is required',
          enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Turtle', 'Hamster', 'Horse']
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number],
          default: void 0,
          required: 'The location of your pet is required',
          validate: {
            validator: function([lng, lat]) {
              return isFinite(lng) && isFinite(lat) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
            },
            message: props => `Invalid location coordinates`
          }
        }
      },
      age: {
          type: Number
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
          ret.id = doc._id;
          delete ret._id;
          delete ret.__v;
          return ret
      }
  }
});


const Pet = mongoose.model('Animal', petSchema);
module.exports = Pet;


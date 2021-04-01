const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petcareSchema = new Schema({
    name: {
        type: String,
        required: 'Your company name or Nickname required'
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
      description: {
            type: String,
            required:'info of your center or business is required' ,
            minlength: [10, 'Description needs 10 chars at least']
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
           // nota las mascotas pueden ser entregadas por la mañana en un parque o lugar intermedio
          required: 'The location of your center or your workplace',
          validate: {
            validator: function([lng, lat]) {
              return isFinite(lng) && isFinite(lat) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
            },
            message: props => `Invalid location coordinates`
          }
        }
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


const Petcare = mongoose.model('role', petcareSchema);
module.exports = Petcare;
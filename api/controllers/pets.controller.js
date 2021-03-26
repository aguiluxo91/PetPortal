const createError = require('http-errors');
const Pet = require('../models/pet.model');

module.exports.list = (req, res, next) => {
    Pet.find()
      .then(pets => res.json(pets))
      .catch(next)
};

module.exports.get = (req, res, next) => {
    Pet.findById(req.params.id)
      .then(pet => {
        if (pet) res.json(pet)
        else next(createError(404, 'Pet not found'))
      })
      .catch(next)
  };

  module.exports.create = (req, res, next) => {
    const { location } = req.body;
    req.body.location = {
      type: 'Point',
      coordinates: location
    }
  
    Pet.create(req.body)
      .then(pet => res.status(201).json(pet))
      .catch(error => {
        if (error.errors && error.errors['location.coordinates']) {
          error.errors.location = error.errors['location.coordinates'];
          delete error.errors['location.coordinates'];
        }
        next(error);
      })
  };

  module.exports.delete = (req, res, next) => {
    Pet.findByIdAndDelete(req.params.id)
      .then(pet => {
        if (pet) res.status(204).json({})
        else next(createError(404, 'Pet not found'))
      })
      .catch(next)
  };

  module.exports.update = (req, res, next) => {
    const { location } = req.body;
    if (location) {
      req.body.location = {
        type: 'Point',
        coordinates: location
      }
    }
    
    Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(pet => {
        if (pet) res.json(pet)
        else next(createError(404, 'Pet not found'))
      })
      .catch(next)
  };
const createError = require('http-errors');
const Petcare = require('../models/petcare.model');

module.exports.list = (req, res, next) => {
    Petcare.find()
      .then(petscare => res.json(petscare))
      .catch(next)
};

module.exports.get = (req, res, next) => {
    Petcare.findById(req.params.id)
      .then(petcare => {
        if (petcare) res.json(petcare)
        else next(createError(404, 'Petcare not found'))
      })
      .catch(next)
  };

  module.exports.create = (req, res, next) => {
    const { location } = req.body;
    req.body.location = {
      type: 'Point',
      coordinates: location
    }
  
    Petcare.create(req.body)
      .then(petcare => res.status(201).json(petcare))
      .catch(error => {
        if (error.errors && error.errors['location.coordinates']) {
          error.errors.location = error.errors['location.coordinates'];
          delete error.errors['location.coordinates'];
        }
        next(error);
      })
  };

  module.exports.delete = (req, res, next) => {
    Petcare.findByIdAndDelete(req.params.id)
      .then(petcare => {
        if (petcare) res.status(204).json({})
        else next(createError(404, 'Petcare not found'))
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
    
    Petcare.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(petcare => {
        if (petcare) res.json(petcare)
        else next(createError(404, 'Petcare not found'))
      })
      .catch(next)
  };
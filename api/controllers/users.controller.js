const createError = require('http-errors');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.create = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                next(createError(400, { errors: { email: 'This email already exists' } }))
            } else {
                return User.create(req.body)
                    .then(user => res.status(201).json(user))
            }
        })
        .catch(next)
};

module.exports.list = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(next)
};

module.exports.get = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(next);
};

module.exports.delete = (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.status(204).end())
        .catch(next)
};

module.exports.update = (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, req.body, { new: true })
        .then(user => res.status(202).json(user))
        .catch(next)
};
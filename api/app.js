require('dotenv').config();

const mongoose = require('mongoose');
const createError = require('http-errors');
const logger = require('morgan');
const express = require('express');
const passport = require('passport');
const session = require('./config/session.config');
require('./config/passport.config');
require('./config/db.config');

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const router = require('./config/routes.config');
app.use('/api', router);

app.use((error, req, res, next) => {
    if (error instanceof mongoose.Error.ValidationError) error = createError(400, error)
    else if (error instanceof mongoose.Error.CastError) error = createError(404, 'Resource not found')
    else if (error.message.includes('E11000')) error = createError(400, 'Already exists')

    console.log(error)

    const data = {};
    data.message = error.message;
    data.errors = error.errors ?
        Object.keys(error.errors)
            .reduce((errors, key) => ({ ...errors, [key]: error.errors[key].message }), {}) : 
            undefined;

    res.status(error.status || 500).json(data)
});

const port = Number(process.env.PORT || 3001);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Ready! Listen on port ${port}`);
    })
};

module.exports = app
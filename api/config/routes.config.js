const express = require('express');
const router = express.Router();
const pets = require('../controllers/pets.controller');
const users = require('../controllers/users.controller');

const secure = require('../middlewares/secure.middleware');

//PETS ROUTES

router.get('/pets', pets.list);
router.post('/pets', pets.create);
router.get('/pets/:id', pets.get);
router.delete('/pets/:id', pets.delete);
router.put('/pets/:id', pets.update);


//USERS ROUTES

router.get('/users', users.list);
router.post('/users', users.create);
router.get('/users/:id', users.get);
router.delete('/users/:id', users.delete);
router.put('/users/:id', users.update);
router.post('/login', users.login);
router.post('/logout', users.logout);
router.get('/activate', users.activate);


module.exports = router;
const express = require('express');
const router = express.Router();
const pets = require('../controllers/pets.controller');

const secure = require('../middlewares/secure.middelware');

router.get('/pets', pets.list);
router.post('/pets', pets.create);
router.get('/pets/:id', pets.get);
router.delete('/pets/:id', pets.delete);
router.put('/pets/:id', pets.update);



module.exports = router;
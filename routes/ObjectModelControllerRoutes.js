const express = require('express');
const ObjectModelController = require('../controllers/ObjectModelController');

const router = express.Router();

router.post('/objects', ObjectModelController.createObjectModel);
router.get('/objects/:id', ObjectModelController.getObjectModel);
router.put('/objects/:id', ObjectModelController.updateObjectModel);
router.delete('/objects/:id', ObjectModelController.deleteObjectModel);

module.exports = router;

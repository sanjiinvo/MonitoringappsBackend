const express = require('express');
const ObjectModelController = require('../controllers/ObjectModelController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/object', auth(['Moder', 'Admin']), ObjectModelController.createObjectModel);
router.get('/object/:id', auth(), ObjectModelController.getObjectModel);
router.put('/object/:id', auth(), ObjectModelController.updateObjectModel);
router.delete('/object/:id', auth(), ObjectModelController.deleteObjectModel);
router.get('/objects', auth(), ObjectModelController.getAllObjectModels)

module.exports = router;

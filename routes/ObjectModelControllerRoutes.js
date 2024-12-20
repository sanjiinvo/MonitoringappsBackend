const express = require('express');
const ObjectModelController = require('../controllers/ObjectModelController');
const auth = require('../middlewares/auth');
const dynamicTableModel = require('../middlewares/dynamicTableModel');
const router = express.Router();

router.post('/newobject', auth(['Moder', 'Admin']), ObjectModelController.createObjectModel);
router.get('/object/:id', auth(), ObjectModelController.getObjectModel);
router.put('/object/:id', auth(), ObjectModelController.updateObjectModel);
router.delete('/object/:id', auth(), ObjectModelController.deleteObjectModel);
router.get('/objects', auth(), ObjectModelController.getAllObjectModels);
router.get('/objectinfo/:objectId', auth(), dynamicTableModel, ObjectModelController.GetInfoOfObjectById);
router.patch('/:objectId/process/status', dynamicTableModel, ObjectModelController.updateProcessStatus);

module.exports = router;

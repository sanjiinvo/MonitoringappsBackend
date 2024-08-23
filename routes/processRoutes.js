const express = require('express');
const ProcessController = require('../controllers/ProcessController');

const router = express.Router();

router.post('/processes', ProcessController.createProcess);
router.get('/processes/:id', ProcessController.getProcess);
router.put('/processes/:id', ProcessController.updateProcess);
router.delete('/processes/:id', ProcessController.deleteProcess);

module.exports = router;

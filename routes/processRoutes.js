const express = require('express');
const ProcessController = require('../controllers/ProcessController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/process', auth(['Admin', 'Moder']), ProcessController.createProcess);
router.get('/process/:id', auth(), ProcessController.getProcess);
router.put('/process/:id', auth(), ProcessController.updateProcess);
router.delete('/processesid', auth(), ProcessController.deleteProcess);
router.get('/processes', auth(), ProcessController.getAllProcesses);

module.exports = router;

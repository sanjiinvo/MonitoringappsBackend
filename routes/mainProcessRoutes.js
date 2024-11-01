const express = require('express')
const MainProcessController = require('../controllers/mainProcessController')
const auth = require('../middlewares/auth')

const router = express.Router()

router.post('/newmainprocess', MainProcessController.createMainProcess)
router.get('/mainprocess/:id', MainProcessController.getMainProcessById)
router.get('/mainprocesses', MainProcessController.getAllMainProcesses)
router.put('mainprocess/:id',MainProcessController.updateMainProcess)
router.delete('mainprocess/:id', MainProcessController.deleteMainProcess)

module.exports = router
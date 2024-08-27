const express = require('express');
const UserController = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/newuser', UserController.createUser)
router.get('/user/:id',auth(), UserController.getUser)
router.put('/user/:id', auth(), UserController.updateUser)
router.delete('/user/:id', auth(), UserController.deleteUser)
// router.get('/users', auth(), UserController.getAllUsers)
router.post('/login',UserController.logIn)
router.get('/users', UserController.getAllUsers)

module.exports = router;

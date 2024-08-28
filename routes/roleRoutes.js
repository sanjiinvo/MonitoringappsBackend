const express = require('express');
const RoleController = require('../controllers/roleController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/newrole', auth(['Admin', 'Moder']), RoleController.createRole);
router.get('/roles/:id', auth(), RoleController.getRole);
router.put('/roles/:id', auth(), RoleController.updateRole);
router.delete('/roles/:id', auth(), RoleController.deleteRole);
router.get('/roles', auth(), RoleController.getAllRoles);
module.exports = router;

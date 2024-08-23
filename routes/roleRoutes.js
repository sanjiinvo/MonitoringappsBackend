const express = require('express');
const RoleController = require('../controllers/roleController');

const router = express.Router();

router.post('/roles', RoleController.createRole);
router.get('/roles/:id', RoleController.getRole);
router.put('/roles/:id', RoleController.updateRole);
router.delete('/roles/:id', RoleController.deleteRole);

module.exports = router;

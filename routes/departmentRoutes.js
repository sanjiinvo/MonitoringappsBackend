const express = require('express');
const DepartmentController = require('../controllers/DepartmentController');
const auth = require('../middlewares/auth');

const router = express.Router();
// auth(['Admin', 'Moder']),
router.post('/newdepartment',  DepartmentController.createDepartment);
router.get('/departments', auth(), DepartmentController.getAllDepartments);
router.get('/department/:id', auth(), DepartmentController.getDepartment);
router.put('/department/:id', auth(), DepartmentController.updateDepartment);
router.delete('/department/:id', auth(), DepartmentController.deleteDepartment);

module.exports = router;

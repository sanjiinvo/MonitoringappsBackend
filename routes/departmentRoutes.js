const express = require('express');
const DepartmentController = require('../controllers/DepartmentController');

const router = express.Router();

router.post('/departments', DepartmentController.createDepartment);
router.get('/departments/:id', DepartmentController.getDepartment);
router.put('/departments/:id', DepartmentController.updateDepartment);
router.delete('/departments/:id', DepartmentController.deleteDepartment);

module.exports = router;

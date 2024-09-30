const express = require('express');
const router = express.Router();
const StatusController = require('../controllers/statusController');

// CRUD маршруты для статусов
router.get('/statuses', StatusController.getAllStatuses); // Получение всех статусов
router.get('/statuses/:id', StatusController.getStatusById); // Получение статуса по ID
router.post('/newstatus', StatusController.createStatus); // Создание нового статуса
router.put('/statuses/:id', StatusController.updateStatus); // Обновление статуса
router.delete('/statuses/:id', StatusController.deleteStatus); // Удаление статуса

module.exports = router;

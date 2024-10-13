const { Status} = require('../models/models'); // Импорт модели Status

class StatusController {
  // Получение всех статусов
  static async getAllStatuses(req, res) {
    try {
      const statuses = await Status.findAll();
      res.status(200).json(statuses);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении статусов.' });
    }
  }

  // Получение статуса по ID
  static async getStatusById(req, res) {
    const { id } = req.params;
    try {
      const status = await Status.findByPk(id);
      if (!status) {
        return res.status(404).json({ error: 'Статус не найден.' });
      }
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении статуса.' });
    }
  }

  // Создание нового статуса
  static async createStatus(req, res) {
    const { name, description } = req.body;
    try {
      const existingStatus = await Status.findOne({ where: { name } });
      if (existingStatus) {
        return res.status(400).json({ error: 'Статус с таким именем уже существует.' });
      }

      const newStatus = await Status.create({ name, description });
      res.status(201).json(newStatus);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании статуса.' });
    }
  }

  // Обновление существующего статуса
  static async updateStatus(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const status = await Status.findByPk(id);
      if (!status) {
        return res.status(404).json({ error: 'Статус не найден.' });
      }

      // Обновляем статус
      status.name = name || status.name;
      status.description = description || status.description;
      await status.save();

      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении статуса.' });
    }
  }

  // Удаление статуса
  static async deleteStatus(req, res) {
    const { id } = req.params;
    try {
      const status = await Status.findByPk(id);
      if (!status) {
        return res.status(404).json({ error: 'Статус не найден.' });
      }

      await status.destroy();
      res.status(200).json({ message: 'Статус успешно удален.' });
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении статуса.' });
    }
  }
}

module.exports = StatusController;

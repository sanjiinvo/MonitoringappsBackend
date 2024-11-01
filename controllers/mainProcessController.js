const { MainProcess, Department, Process } = require('../models/models');

class MainProcessController {
  
  // Получение всех главных процессов
  static async getAllMainProcesses(req, res) {
    try {
      const mainProcesses = await MainProcess.findAll({
        include: [
          { model: Department, attributes: ['departmentName'] },
        ]
      });
      res.status(200).json(mainProcesses);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении главных процессов.' });
    }
  }

  // Получение главного процесса по ID
  static async getMainProcessById(req, res) {
    try {
      const { id } = req.params;
      const mainProcess = await MainProcess.findByPk(id, {
        include: [
          { model: Department, attributes: ['departmentName'] },
          { model: Process, as: 'SubProcesses' }
        ]
      });

      if (!mainProcess) {
        return res.status(404).json({ error: 'Главный процесс не найден.' });
      }

      res.status(200).json(mainProcess);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении главного процесса.' });
    }
  }

  // Создание нового главного процесса
  static async createMainProcess(req, res) {
    try {
      const { name, description, departmentId, subProcesses } = req.body;
      
      const mainProcess = await MainProcess.create({ 
        name, 
        description, 
        departmentId
      });

      if (subProcesses && subProcesses.length > 0) {
        await mainProcess.addSubProcesses(subProcesses);
      }

      res.status(201).json(mainProcess);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании главного процесса.' });
    }
  }

  // Обновление существующего главного процесса
  static async updateMainProcess(req, res) {
    try {
      const { id } = req.params;
      const { name, description, departmentId, subProcesses } = req.body;
      
      const mainProcess = await MainProcess.findByPk(id);

      if (!mainProcess) {
        return res.status(404).json({ error: 'Главный процесс не найден.' });
      }

      await mainProcess.update({ name, description, departmentId });

      if (subProcesses && subProcesses.length > 0) {
        await mainProcess.setSubProcesses(subProcesses);
      }

      res.status(200).json(mainProcess);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при обновлении главного процесса.' });
    }
  }

  // Удаление главного процесса
  static async deleteMainProcess(req, res) {
    try {
      const { id } = req.params;
      
      const mainProcess = await MainProcess.findByPk(id);

      if (!mainProcess) {
        return res.status(404).json({ error: 'Главный процесс не найден.' });
      }

      await mainProcess.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при удалении главного процесса.' });
    }
  }
}

module.exports = MainProcessController;

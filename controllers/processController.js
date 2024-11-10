const { Process, ProcessDependency, Department, ObjectModel, Status, MainProcess, MainProcessDependency } = require('../models/models');

class ProcessController {
  static async createProcess(req, res) {
    const { name, description, workingTime, departmentId, dependencies, mainProcessDependency } = req.body;

    try {
      // Создаем новый процесс
      const newProcess = await Process.create({
        name,
        description,
        workingTime,
        departmentId: departmentId || null,
      });

      // Устанавливаем зависимости с другими обычными процессами
      if (dependencies && dependencies.length > 0) {
        await newProcess.addDependencies(dependencies);
      }

      // Устанавливаем зависимость от главного процесса, если он указан
      if (mainProcessDependency) {
        await MainProcessDependency.create({
          mainProcessId: mainProcessDependency,
          processId: newProcess.id,
        });
      }

      res.status(201).json(newProcess);
    } catch (error) {
      console.error("Ошибка при создании процесса:", error);
      res.status(500).json({ error: "Ошибка при создании процесса." });
    }
  }
  static async getProcess(req, res) {
    try {
      const process = await Process.findByPk(req.params.id);
      if (process) {
        res.status(200).json(process);
      } else {
        res.status(404).json({ error: 'Process not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllProcesses(req, res) {
    try {
      const processes = await Process.findAll();
      res.status(200).json(processes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProcess(req, res) {
    try {
      const process = await Process.findByPk(req.params.id);
      if (process) {
        await process.update(req.body);
        res.status(200).json(process);
      } else {
        res.status(404).json({ error: 'Process not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProcess(req, res) {
    try {
      const process = await Process.findByPk(req.params.id);
      if (process) {
        await process.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Process not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getProcessesWithoutDependencies(req, res) {
    const objectId = req.params.objectId;
    try {
      const processes = await Process.findAll({
        where: { objectId },
        include: [{
          model: ProcessDependency,
          required: false, // LEFT JOIN
          where: { DependencyId: null }
        }]
      });
      res.json(processes);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching processes' });
    }
  }

  static async startProcess(req, res) {
    const processId = req.params.processId;
    try {
      // Поиск ID статуса "В процессе"
      const inProgressStatus = await Status.findOne({ where: { statusName: 'В процессе' } });

      if (!inProgressStatus) {
        return res.status(500).json({ error: 'Статус "В процессе" не найден. Проверьте таблицу статусов.' });
      }

      // Обновляем статус процесса на "В процессе"
      await Process.update({ statusId: inProgressStatus.id }, { where: { id: processId } });

      // Запускаем все процессы, которые зависят от данного
      const dependentProcesses = await ProcessDependency.findAll({ where: { DependencyId: processId } });

      for (const dependency of dependentProcesses) {
        await Process.update({ statusId: inProgressStatus.id }, { where: { id: dependency.processId } });
      }

      res.json({ message: 'Process started successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error starting process' });
    }
  }
}

module.exports = ProcessController;

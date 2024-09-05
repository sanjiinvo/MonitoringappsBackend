const { Process, ProcessDependency, Department, ObjectModel } = require('../models/models');


class ProcessController {
  static async createProcess(req, res, next) {
    try {
        const { name, description, workingTime, departmentId, dependencies } = req.body;

        // Создание самого процесса
        const newProcess = await Process.create({
            name,
            description,
            workingTime,
            departmentId,
            status: 'в ожидании'
        });

        // Добавление зависимостей
        if (dependencies && dependencies.length > 0) {
            await Promise.all(dependencies.map(async (dependencyId) => {
                await ProcessDependency.create({
                    processId: newProcess.id,  // Здесь мы используем id созданного процесса
                    DependencyId: dependencyId
                });
            }));
        }

        res.status(201).json(newProcess);
    } catch (error) {
        console.error('Error creating process:', error);
        res.status(500).json({ error: error.message });
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
}

module.exports = ProcessController;

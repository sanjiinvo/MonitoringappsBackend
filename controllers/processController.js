const { Process } = require('../models/models');

class ProcessController {
  static async createProcess(req, res) {
    try {
      const process = await Process.create(req.body);
      res.status(201).json(process);
    } catch (error) {
      res.status(400).json({ error: error.message });
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

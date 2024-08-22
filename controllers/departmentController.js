const { Department } = require('../models/models');

class DepartmentController {
  static async createDepartment(req, res) {
    try {
      const department = await Department.create(req.body);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getDepartment(req, res) {
    try {
      const department = await Department.findByPk(req.params.id);
      if (department) {
        res.status(200).json(department);
      } else {
        res.status(404).json({ error: 'Department not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateDepartment(req, res) {
    try {
      const department = await Department.findByPk(req.params.id);
      if (department) {
        await department.update(req.body);
        res.status(200).json(department);
      } else {
        res.status(404).json({ error: 'Department not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteDepartment(req, res) {
    try {
      const department = await Department.findByPk(req.params.id);
      if (department) {
        await department.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Department not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = DepartmentController;

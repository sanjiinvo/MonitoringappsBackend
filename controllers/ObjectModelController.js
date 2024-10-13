const { ObjectModel } = require('../models/models');
const {Sequelize} = require('sequelize')
class ObjectModelController {
  static async createObjectModel(req, res) {
    const { name, description, type, statusId } = req.body;

    try {
      const defaultStatusId = statusId || 1; // Устанавливаем статус по умолчанию, если statusId не передан
      const objectModel = await ObjectModel.create({
        name,
        description,
        type,
        statusId: defaultStatusId,
      });

      res.status(201).json(objectModel);
    } catch (error) {
      console.error('Ошибка при создании объекта:', error);
      res.status(400).json({ error: 'Ошибка при создании объекта.' });
    }
  }

  static async getObjectModel(req, res) {
    try {
      const objectModel = await ObjectModel.findByPk(req.params.id);
      if (objectModel) {
        res.status(200).json(objectModel);
      } else {
        res.status(404).json({ error: 'ObjectModel not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getAllObjectModels(req, res) {
    try {
      const objectModels = await ObjectModel.findAll({
        where: {
          departmentId: req.params.departmentId,
        },
      });
      res.status(200).json(objectModels);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async getAllObjectModels(req, res) {
    try {
      const objectModels = await ObjectModel.findAll();
      res.status(200).json(objectModels);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  static async updateObjectModel(req, res) {
    try {
      const objectModel = await ObjectModel.findByPk(req.params.id);
      if (objectModel) {
        await objectModel.update(req.body);
        res.status(200).json(objectModel);
      } else {
        res.status(404).json({ error: 'ObjectModel not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteObjectModel(req, res) {
    try {
      const objectModel = await ObjectModel.findByPk(req.params.id);
      if (objectModel) {
        await objectModel.destroy();
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'ObjectModel not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ObjectModelController;

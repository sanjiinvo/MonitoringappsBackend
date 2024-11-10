// middlewares/dynamicTableModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const ObjectModel = require('../models/models').ObjectModel;

const dynamicModels = {};

// Функция для создания и кэширования модели
async function getDynamicModel(processTableName) {
    if (dynamicModels[processTableName]) {
      return dynamicModels[processTableName];
    }
  
    // Проверка существования таблицы через SQL-запрос
    const tableExists = await sequelize.query(
      `SELECT to_regclass('public."${processTableName}"') IS NOT NULL AS table_exists`,
      { type: sequelize.QueryTypes.SELECT }
    ).then(result => result[0].table_exists);
  
    if (!tableExists) {
      throw new Error(`Таблица ${processTableName} не существует в базе данных`);
    }
  
    // Определяем модель и кэшируем её
    const DynamicModel = sequelize.define(processTableName, {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      objectId: { type: DataTypes.INTEGER },
      processId: { type: DataTypes.INTEGER },
      mainProcessId: { type: DataTypes.INTEGER },
      statusId: { type: DataTypes.INTEGER },
      startDate: { type: DataTypes.DATE },
      endDate: { type: DataTypes.DATE }
    }, { tableName: processTableName, timestamps: false });
  
    dynamicModels[processTableName] = DynamicModel;
    return DynamicModel;
  }

// Middleware для получения динамической модели
async function dynamicTableModel(req, res, next) {
  try {
    const { objectId } = req.params;

    const currentObject = await ObjectModel.findByPk(objectId, {
      attributes: ['processTableName']
    });

    if (!currentObject || !currentObject.processTableName) {
      return res.status(404).json({ error: 'Таблица для процессов объекта не найдена' });
    }

    const processTableName = currentObject.processTableName;
    req.dynamicModel = await getDynamicModel(processTableName);
    next();
  } catch (error) {
    console.error('Ошибка в middleware динамической модели:', error);
    res.status(500).json({ error: 'Ошибка при загрузке динамической модели.' });
  }
}

module.exports = dynamicTableModel;

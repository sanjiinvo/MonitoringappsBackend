const { ObjectModel, Process, MainProcess, ObjectProcessStatus, Status, MainProcessDependency } = require('../models/models');
const sequelize = require('../db');
const { DataTypes,Op } = require('sequelize');
class ObjectModelController {
  static async createObjectModel(req, res) {
    const { name, description, type, statusId, objectLatName } = req.body;
  
    const transaction = await sequelize.transaction();  // Открытие транзакции
    try {
      // 1. Создаем новый объект и получаем его ID
      const objectModel = await ObjectModel.create({
        processTableName: objectLatName,
        name,
        description,
        type,
        statusId: statusId || 1, // Устанавливаем статус по умолчанию, если не передан
      }, { transaction });
  
      const objectId = objectModel.id;  // Получаем ID созданного объекта
  
      // 2. Получаем все существующие процессы и главные процессы
      const [processes, mainProcesses] = await Promise.all([
        Process.findAll({ attributes: ['id'] }),
        MainProcess.findAll({ attributes: ['id'] })
      ]);
  
      // 3. Создаем динамическую модель для новой таблицы
      const DynamicProcessStatusModel = sequelize.define(objectLatName, {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        objectId: { 
          type: DataTypes.INTEGER, 
          references: { model: ObjectModel, key: 'id' }, 
          allowNull: false, 
          onDelete: 'CASCADE' 
        },
        processId: { 
          type: DataTypes.INTEGER, 
          allowNull: true, 
          references: { model: Process, key: 'id' }, 
          onDelete: 'CASCADE' 
        },
        mainProcessId: { 
          type: DataTypes.INTEGER, 
          allowNull: true, 
          references: { model: MainProcess, key: 'id' }, 
          onDelete: 'CASCADE' 
        },
        statusId: { 
          type: DataTypes.INTEGER, 
          references: { model: Status, key: 'id' }, 
          allowNull: false, 
          defaultValue: 1 
        },
        startDate: { type: DataTypes.DATE },
        endDate: { type: DataTypes.DATE },
      }, { 
        sequelize, 
        modelName: objectLatName,
        freezeTableName:true,
        indexes: [
          {
            unique: true,
            fields: ['objectId', 'processId']  // Уникальное ограничение на комбинацию objectId и processId
          }
        ]
      });
  
      // Синхронизируем новую модель, чтобы создать таблицу в базе данных
      await DynamicProcessStatusModel.sync({ transaction });
      console.log(`создали таблицу ${DynamicProcessStatusModel}`);
      
      // 4. Формируем записи для добавления в динамическую таблицу
      const objectProcessStatusEntries = [
        ...processes.map(process => ({
          objectId,
          processId: process.id,
          statusId: 1  // "не начат"
        })),
        ...mainProcesses.map(mainProcess => ({
          objectId,
          mainProcessId: mainProcess.id,
          statusId: 1  // "не начат"
        }))
      ];
  
      // 5. Добавляем записи в новую динамическую таблицу
      await DynamicProcessStatusModel.bulkCreate(objectProcessStatusEntries, { transaction });
  
      // Завершаем транзакцию
      await transaction.commit();  
      res.status(201).json(objectModel);  // Возвращаем созданный объект
      console.log(objectLatName);
      
    } catch (error) {
      await transaction.rollback();  // Откат транзакции в случае ошибки
      console.error('Ошибка при создании объекта:', error);
      res.status(400).json({ error: 'Ошибка при создании объекта.' });
    }
  }
  
//используем дефайн и затем вытаскиваем из динам таблицы 
static async GetInfoOfObjectById(req, res) {
  const { objectId } = req.params;
  
  try {
      // Получаем записи для обычных процессов из динамической таблицы
      const processStatuses = await req.dynamicModel.findAll({
          where: { objectId, processId: { [Op.ne]: null } },
          attributes: ['processId', 'statusId']
      });

      // Получаем записи для главных процессов из динамической таблицы
      const mainProcessStatuses = await req.dynamicModel.findAll({
          where: { objectId, mainProcessId: { [Op.ne]: null } },
          attributes: ['mainProcessId', 'statusId']
      });

      if (!processStatuses.length && !mainProcessStatuses.length) {
          return res.status(404).json({ error: 'Нет данных для указанного объекта' });
      }

      // Извлекаем ID статусов и процессов для дальнейшего запроса
      const statusIds = [
          ...new Set([
              ...processStatuses.map((status) => status.statusId),
              ...mainProcessStatuses.map((status) => status.statusId),
          ]),
      ];
      
      const processIds = processStatuses.map((status) => status.processId);
      const mainProcessIds = mainProcessStatuses.map((status) => status.mainProcessId);

      // Получаем статусы, названия обычных процессов и главных процессов
      const [statuses, processes, mainProcesses] = await Promise.all([
          Status.findAll({
              where: { id: statusIds },
              attributes: ['id', 'statusName']
          }),
          Process.findAll({
              where: { id: processIds },
              attributes: ['id', 'name']
          }),
          MainProcess.findAll({
              where: { id: mainProcessIds },
              attributes: ['id', 'name']
          })
      ]);

      // Создаем мапу статусов и названий процессов для быстрого доступа
      const statusMap = statuses.reduce((map, status) => {
          map[status.id] = status.statusName;
          return map;
      }, {});

      const processNameMap = processes.reduce((map, process) => {
          map[process.id] = process.name;
          return map;
      }, {});

      const mainProcessNameMap = mainProcesses.reduce((map, mainProcess) => {
          map[mainProcess.id] = mainProcess.name;
          return map;
      }, {});

      // Формируем массивы с данными процессов и названиями статусов
      const processesWithStatus = processStatuses.map((processStatus) => ({
          processId: processStatus.processId,
          statusId: processStatus.statusId,
          statusName: statusMap[processStatus.statusId] || null,
          processName: processNameMap[processStatus.processId] || null
      }));

      const mainProcessesWithStatus = mainProcessStatuses.map((mainProcessStatus) => ({
          mainProcessId: mainProcessStatus.mainProcessId,
          statusId: mainProcessStatus.statusId,
          statusName: statusMap[mainProcessStatus.statusId] || null,
          mainProcessName: mainProcessNameMap[mainProcessStatus.mainProcessId] || null
      }));

      // Возвращаем ответ с данными о процессах и их статусах
      res.status(200).json({
          processes: processesWithStatus,
          mainProcesses: mainProcessesWithStatus
      });
  } catch (error) {
      console.error('Ошибка при получении информации объекта:', error);
      res.status(500).json({ error: 'Ошибка при получении данных процессов объекта.' });
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

// обновления главного статуса у объекта ObjectModelController
static async updateProcessStatus(req, res) {
  const { objectId, processId, mainProcessId, newStatusId } = req.body;

  try {
      // Получаем динамическую модель через middleware
      const dynamicModel = req.dynamicModel;

      if (!dynamicModel) {
          return res.status(500).json({ error: 'Динамическая модель не была найдена' });
      }

      // Условия для определения, обновлять процесс или главный процесс
      const whereClause = processId
          ? { objectId, processId }
          : { objectId, mainProcessId };

      // Выполняем обновление статуса для главного процесса или процесса
      const [updatedRows] = await dynamicModel.update(
          { statusId: newStatusId },
          { where: whereClause }
      );

      if (updatedRows === 0) {
          return res.status(404).json({ error: 'Запись для обновления не найдена' });
      }

      // Если обновляем главный процесс, ищем и обновляем зависимые процессы
      if (mainProcessId && newStatusId === 2) { // Проверяем, что процесс "начат"
          // Ищем обычные процессы, зависящие от данного главного процесса
          const dependentProcesses = await MainProcessDependency.findAll({
              where: { mainProcessId },
              attributes: ['processId']
          });

          // Обновляем статус на "начат" для зависимых процессов в dynamicModel
          for (const dependency of dependentProcesses) {
              await dynamicModel.update(
                  { statusId: newStatusId },
                  { where: { objectId, processId: dependency.processId, statusId: 1 } } // только если процесс "не начат"
              );
          }
      }

      res.status(200).json({ message: 'Статус успешно обновлен и зависимости обновлены' });
  } catch (error) {
      console.error('Ошибка при обновлении статуса процесса:', error);
      res.status(500).json({ error: 'Ошибка при обновлении статуса процесса' });
  }
}


  
}

module.exports = ObjectModelController;

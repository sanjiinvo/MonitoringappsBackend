const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcrypt');

// Модель для отделов
class Department extends Model {}
Department.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'department',
});

// Модель для ролей
class Role extends Model {}
Role.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true },
}, {
  sequelize,
  modelName: 'role',
});

// Модель для пользователей
class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  rlname: { type: DataTypes.STRING, allowNull: false },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },
  rolename: { 
    type: DataTypes.STRING, 
    defaultValue: 'User'
  },
  roleId: { 
    type: DataTypes.INTEGER, 
    references: { model: Role, key: 'id' }
  },
  departmentId: { 
    type: DataTypes.INTEGER, 
    references: { model: Department, key: 'id' }
  },
  currentprocesses: { type: DataTypes.ARRAY(DataTypes.STRING) },
}, {
  sequelize,
  modelName: 'user',
});

// Модель для статусов
class Status extends Model {}
Status.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },  // Описание статуса
}, {
  sequelize,
  modelName: 'status',
});

// Модель для объектов строительства
class ObjectModel extends Model {}
ObjectModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false },
  description: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' }},
  statusId: { type: DataTypes.INTEGER, references: { model: Status, key: 'id' }},  // Ссылка на статус объекта
}, {
  sequelize,
  modelName: 'object',
});

// Модель для процессов
class Process extends Model {}
Process.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false },
  description: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  workingTime: { type: DataTypes.STRING }, // Ожидаемое время выполнения
  departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' }},
  statusId: { type: DataTypes.INTEGER, references: { model: Status, key: 'id' }},  // Ссылка на статус процесса
}, {
  sequelize,
  modelName: 'process',
});

// Модель для связи объектов и пользователей (многие ко многим)
class UserObjectAssociation extends Model {}
UserObjectAssociation.init({}, {
  sequelize,
  modelName: 'UserObjectAssociation',
});

// Модель для связи объектов и процессов (многие ко многим)
class ObjectProcessAssociation extends Model {}
ObjectProcessAssociation.init({
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не начат' },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'ObjectProcessAssociation',
});

// Модель для зависимостей процессов (многие ко многим)
class ProcessDependency extends Model {}
ProcessDependency.init({}, {
  sequelize,
  modelName: 'ProcessDependency',
});

// Ассоциации моделей
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Status, { foreignKey: 'statusId' }); // Связь объекта со статусом
Process.belongsTo(Department, { foreignKey: 'departmentId' });
Process.belongsTo(Status, { foreignKey: 'statusId' }); // Связь процесса со статусом

User.belongsToMany(ObjectModel, { through: UserObjectAssociation });
ObjectModel.belongsToMany(User, { through: UserObjectAssociation });

ObjectModel.belongsToMany(Process, { through: ObjectProcessAssociation });
Process.belongsToMany(ObjectModel, { through: ObjectProcessAssociation });

Process.belongsToMany(Process, { as: 'Dependencies', through: ProcessDependency }); // Процесс может зависеть от другого процесса

// Экспорт моделей
module.exports = {
  User,
  Role,
  Department,
  Status,
  ObjectModel,
  Process,
  UserObjectAssociation,
  ObjectProcessAssociation,
  ProcessDependency,
};

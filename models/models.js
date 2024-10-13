const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

// Определение модели Department
class Department extends Model {}
Department.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'department',
});

// Определение модели Status
class Status extends Model {}
Status.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  statusName: { type: DataTypes.STRING, unique: true }
}, {
  sequelize,
  modelName: 'status',
});

// Определение модели Role (для общей роли пользователя в системе)
class Role extends Model {}
Role.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true },
}, {
  sequelize,
  modelName: 'role',
});

// Определение модели ProjectRole (для ролей проекта)
class ProjectRole extends Model {}
ProjectRole.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true, allowNull: false },
}, {
  sequelize,
  modelName: 'projectrole',
});

// Определение модели User
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

// Определение модели ObjectModel
class ObjectModel extends Model {}
ObjectModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  statusId: { type: DataTypes.INTEGER, references: { model: Status, key: 'id' }}, // Внешний ключ для статуса
}, {
  sequelize,
  modelName: 'object',
});

// Определение модели Process
class Process extends Model {}
Process.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  workingTime: { type: DataTypes.STRING },
  departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' }},
  statusId: { type: DataTypes.INTEGER, references: { model: Status, key: 'id' }}, // Внешний ключ для статуса
}, {
  sequelize,
  modelName: 'process',
});

// Определение модели UserObjectRole (связь пользователя, объекта и роли проекта)
class UserObjectRole extends Model {}
UserObjectRole.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' }},
  objectId: { type: DataTypes.INTEGER, references: { model: 'objects', key: 'id' }},
  projectRoleId: { type: DataTypes.INTEGER, references: { model: 'projectroles', key: 'id' }},
}, {
  sequelize,
  modelName: 'UserObjectRole',
});

// Определение модели UserObjectAssociation
class UserObjectAssociation extends Model {}
UserObjectAssociation.init({}, {
  sequelize,
  modelName: 'UserObjectAssociation',
});

// Определение модели ObjectProcessAssociation
// Определение модели ObjectProcessAssociation
class ObjectProcessAssociation extends Model {}
ObjectProcessAssociation.init({
  statusId: { 
    type: DataTypes.INTEGER,
    references: { 
      model: Status,
      key: 'id'
    },
    allowNull: false,
    defaultValue: 1 // По умолчанию статус "Не начат"
  },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'ObjectProcessAssociation',
});

// Определение модели ProcessDependency
class ProcessDependency extends Model {}
ProcessDependency.init({}, {
  sequelize,
  modelName: 'ProcessDependency',
});

// Ассоциации
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Status, { foreignKey: 'statusId' }); // Связь с моделью Status
Process.belongsTo(Department, { foreignKey: 'departmentId' });
Process.belongsTo(Status, { foreignKey: 'statusId' }); // Связь с моделью Status

User.belongsToMany(ObjectModel, { through: UserObjectAssociation });
ObjectModel.belongsToMany(User, { through: UserObjectAssociation });

ObjectModel.belongsToMany(Process, { through: ObjectProcessAssociation });
Process.belongsToMany(ObjectModel, { through: ObjectProcessAssociation });

Process.belongsToMany(Process, { as: 'Dependencies', through: ProcessDependency });

// Ассоциации для новой модели
User.belongsToMany(ObjectModel, { through: UserObjectRole });
ObjectModel.belongsToMany(User, { through: UserObjectRole });
ProjectRole.belongsToMany(UserObjectRole, { through: UserObjectRole });

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
  UserObjectRole,
  ProjectRole,
};

const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

// Модель Department
class Department extends Model {}
Department.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
}, { sequelize, modelName: 'department' });

// Модель Status
class Status extends Model {}
Status.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  statusName: { type: DataTypes.STRING, unique: true },
}, { sequelize, modelName: 'status' });

// Модель Role
class Role extends Model {}
Role.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true },
}, { sequelize, modelName: 'role' });

// Модель ProjectRole
class ProjectRole extends Model {}
ProjectRole.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true, allowNull: false },
}, { sequelize, modelName: 'projectrole' });

// Модель User
class User extends Model {}
User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  rlname: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rolename: { type: DataTypes.STRING, defaultValue: 'User' },
  roleId: { type: DataTypes.INTEGER, references: { model: Role, key: 'id' }},
  departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' }},
  currentprocesses: { type: DataTypes.ARRAY(DataTypes.STRING) },
}, { sequelize, modelName: 'user' });

// Модель ObjectModel
class ObjectModel extends Model {}
ObjectModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  processTableName:{ type: DataTypes.STRING},
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  statusId: { type: DataTypes.INTEGER, references: { model: Status, key: 'id' } },
}, { sequelize, modelName: 'object' });

// Модель MainProcess
class MainProcess extends Model {}
MainProcess.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { sequelize, modelName: 'main_process' });

// Модель Process
class Process extends Model {}
Process.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  endData: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  workingTime: { type: DataTypes.STRING },
  departmentId: { type: DataTypes.INTEGER, references: { model: Department, key: 'id' }},
}, { sequelize, modelName: 'process' });

// Модель ObjectProcessStatus для отслеживания статусов процессов в объектах
// class ObjectProcessStatus extends Model {}

// // ObjectProcessStatus.init({
// //   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
// //   objectId: { 
// //     type: DataTypes.INTEGER, 
// //     references: { model: ObjectModel, key: 'id' }, 
// //     allowNull: false, 
// //     onDelete: 'CASCADE' 
// //   },
// //   processId: { 
// //     type: DataTypes.INTEGER, 
// //     allowNull: true, 
// //     references: { model: Process, key: 'id' }, 
// //     onDelete: 'CASCADE' 
// //   },
// //   mainProcessId: { 
// //     type: DataTypes.INTEGER, 
// //     allowNull: true, 
// //     references: { model: MainProcess, key: 'id' }, 
// //     onDelete: 'CASCADE' 
// //   },
// //   statusId: { 
// //     type: DataTypes.INTEGER, 
// //     references: { model: Status, key: 'id' }, 
// //     allowNull: false, 
// //     defaultValue: 1 
// //   },
// //   startDate: { type: DataTypes.DATE },
// //   endDate: { type: DataTypes.DATE },
// // }, { 
// //   sequelize, 
// //   modelName: 'object_process_status',
// //   indexes: [
// //     {
// //       unique: true,
// //       fields: ['objectId', 'processId']  // Уникальное ограничение на комбинацию objectId и processId
// //     }
// //   ]
// // });

// Модель UserObjectRole
class UserObjectRole extends Model {}
UserObjectRole.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' }},
  objectId: { type: DataTypes.INTEGER, references: { model: ObjectModel, key: 'id' }},
  projectRoleId: { type: DataTypes.INTEGER, references: { model: ProjectRole, key: 'id' }},
}, { sequelize, modelName: 'user_object_role' });

// Модель MainProcessDependency для связей между главным процессом и обычными процессами
class MainProcessDependency extends Model {}
MainProcessDependency.init({}, { sequelize, modelName: 'main_process_dependency' });

// Модель ProcessDependency для связей между обычными процессами
class ProcessDependency extends Model {}
ProcessDependency.init({}, { sequelize, modelName: 'process_dependency' });

// Ассоциации
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Department, { foreignKey: 'departmentId' });
ObjectModel.belongsTo(Status, { foreignKey: 'statusId' });

// Ассоциации между объектами и процессами через ObjectProcessStatus
// ObjectModel.belongsToMany(Process, { through: ObjectProcessStatus, foreignKey: 'objectId' });
// ObjectModel.belongsToMany(MainProcess, { through: ObjectProcessStatus, foreignKey: 'objectId' });
// Process.belongsToMany(ObjectModel, { through: ObjectProcessStatus, foreignKey: 'processId' });
// MainProcess.belongsToMany(ObjectModel, { through: ObjectProcessStatus, foreignKey: 'mainProcessId' });

// Ассоциации для зависимостей между процессами
Process.belongsToMany(Process, { as: 'Dependencies', through: ProcessDependency });
MainProcess.belongsToMany(Process, { as: 'SubProcesses', through: MainProcessDependency });

// Экспорт моделей
module.exports = {
  User,
  Role,
  Department,
  Status,
  ObjectModel,
  MainProcess,
  Process,
  // ObjectProcessStatus,
  UserObjectRole,
  MainProcessDependency,
  ProcessDependency,
  ProjectRole,
};

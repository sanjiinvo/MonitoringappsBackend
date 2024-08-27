const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../db'); // Импортируйте ваше подключение к базе данных
const bcrypt = require('bcrypt');
// Определение модели Department
class Department extends Model {}
Department.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  departmentName: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'department',
});

// Определение модели User
class User extends Model {}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
    set(value) {
      const salt = bcrypt.genSaltSync(10);
      this.setDataValue('password', bcrypt.hashSync(value, salt));
    }
  },
  rolename: { 
    type: DataTypes.STRING, 
    defaultValue: 'User'  // Убедитесь, что роль по умолчанию — 'User', если это необходимо
  },
  departmentId: { type: DataTypes.INTEGER, references: { model: 'departments', key: 'id' }},
  currentprocesses: { type: DataTypes.ARRAY(DataTypes.STRING) },
}, {
  sequelize,
  modelName: 'user',
});

module.exports = User;


// Определение модели Role
class Role extends Model {}
Role.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, unique: true },
}, {
  sequelize,
  modelName: 'role',
});

// Определение модели ObjectModel
class ObjectModel extends Model {}
ObjectModel.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false },
  description: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE },
  endData: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  departmentId: { type: DataTypes.INTEGER, references: { model: 'departments', key: 'id' }},
}, {
  sequelize,
  modelName: 'object',
});

// Определение модели Process
class Process extends Model {}
Process.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false },
  description: { type: DataTypes.STRING },
  startData: { type: DataTypes.DATE },
  endData: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  departmentId: { type: DataTypes.INTEGER, references: { model: 'departments', key: 'id' }},
}, {
  sequelize,
  modelName: 'process',
});

// Определение модели UserObjectAssociation
class UserObjectAssociation extends Model {}
UserObjectAssociation.init({}, {
  sequelize,
  modelName: 'UserObjectAssociation',
});

// Определение модели ObjectProcessAssociation
class ObjectProcessAssociation extends Model {}
ObjectProcessAssociation.init({
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Не начат' },
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
User.belongsTo(Role, {as: 'role'  });
User.belongsTo(Department);
ObjectModel.belongsTo(Department);
Process.belongsTo(Department);

User.belongsToMany(ObjectModel, { through: UserObjectAssociation });
ObjectModel.belongsToMany(User, { through: UserObjectAssociation });

ObjectModel.belongsToMany(Process, { through: ObjectProcessAssociation });
Process.belongsToMany(ObjectModel, { through: ObjectProcessAssociation });

Process.belongsToMany(Process, { as: 'Dependencies', through: ProcessDependency });

// Экспорт моделей
module.exports = {
  User,
  Role,
  Department,
  ObjectModel,
  Process,
  UserObjectAssociation,
  ObjectProcessAssociation,
  ProcessDependency,
};

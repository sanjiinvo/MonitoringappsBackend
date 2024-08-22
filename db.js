const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DbName,
    process.env.DbUser,
    process.env.DbPassword,
    {
        dialect: 'postgres',
        host: process.env.DbHost,
        port: process.env.DbPort,
    }
)
require('dotenv').config();
const { exec } = require('child_process');
const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoute');
const processRoutes = require('./routes/processRoutes');
const objectRoutes = require('./routes/ObjectModelControllerRoutes');
const departmentsRoutes = require('./routes/departmentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const statusRoutes = require('./routes/statusRoutes')
const mainProcessRoutes = require('./routes/mainProcessRoutes')
const cors = require('cors');
const { Department } = require('./models/models');
const { FORCE } = require('sequelize/lib/index-hints');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/statusses',statusRoutes);
app.use('/api/mainprocesses',mainProcessRoutes)

async function recreateDepartmentTable() {
    try {
      // Пересоздание таблицы Department
      await Department.sync({ force: true });
      console.log('Таблица Department успешно пересоздана');
    } catch (error) {
      console.error('Ошибка при пересоздании таблицы Department:', error);
    }
  }

const start = async () => {
    try {
        await sequelize.authenticate();
        // recreateDepartmentTable()
        await sequelize.sync({force: true});
        
        await sequelize.sync({ force: true });

        // Запуск seed-скрипта для начального заполнения базы данных
        exec('node seed.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка при запуске seed-скрипта: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Ошибка при выполнении seed-скрипта: ${stderr}`);
                return;
            }
            console.log(`Результат seed-скрипта: ${stdout}`);
        })


        
        const server = app.listen(PORT, () => {
            let host = server.address().address;
            if (host === '::') {
                host = 'localhost';
            }
            const port = server.address().port;
            console.log(`Server running at http://${host}:${port}`);
        });
        
    } catch (error) {
        console.log(error);
    }
}

start();

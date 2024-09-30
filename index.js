require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const userRoutes = require('./routes/userRoute');
const processRoutes = require('./routes/processRoutes');
const objectRoutes = require('./routes/ObjectModelControllerRoutes');
const departmentsRoutes = require('./routes/departmentRoutes');
const roleRoutes = require('./routes/roleRoutes');
const statusRoutes = require('./routes/statusRoutes')
const cors = require('cors');

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

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
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

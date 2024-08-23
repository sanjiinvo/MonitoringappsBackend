require('dotenv').config();
const express = require('express');
const sequelize = require('./db')
const path = require('path');
const userRoutes = require('./routes/userRoute')
const processRoutes = require('./routes/processRoutes')
const objectRoutes = require('./routes/ObjectModelControllerRoutes')
const departmentsRoutes = require('./routes/departmentRoutes')
const roleRoutes = require('./routes/roleRoutes')


const PORT = process.env.PORT || 5000;


const app = express();
app.use(express.json())

console.log(roleRoutes);
console.log(departmentsRoutes);
console.log(objectRoutes);
console.log(processRoutes);
console.log(userRoutes);







app.use(userRoutes)
app.use(processRoutes)
app.use(objectRoutes)
app.use(departmentsRoutes)
app.use(roleRoutes)



const start = async ()=>{

    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT,()=> console.log(`server on port ${PORT}`)
        )
    } catch (error) {
        console.log(error);
        
    }
}

start()
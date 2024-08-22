require('dotenv').config();
const express = require('express');
const sequelize = require('./db')
const path = require('path');


const PORT = process.env.PORT || 5000;




const app = express();
app.use(express.json())

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
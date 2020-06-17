const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app');

/* ---------------------Conexion a la Base de Datos-----------------*/

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{

    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 

}).then(con =>{
    console.log('Conexion perfecta');
});



//Servidor
const port = 3000;

app.listen(port,()=>{
    console.log(`El servidor arranco ${port}`)
})


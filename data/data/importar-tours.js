const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const modelEventos = require('./../../models/eventosModel')


dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{

    useNewUrlParser: true,
    useCreateIndex: true

}).then(con =>{
    console.log('Conexion perfecta');
});

const eventos = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,`utf-8`))

const importData = async () =>{
    try{
        await modelEventos.create(eventos)
        console.log("Se importaton los Eventos")
        
    }catch(err){
        console.log(err)
    }
    process.exit();
}

const borrarDatos = async () =>{
    try{
        await modelEventos.deleteMany()
        console.log("borrados todos")
       
    }catch(err){
        console.log(err)
    }
    process.exit();
}

if(process.argv[2] === '--import'){
    importData()
}else if (process.argv[2] ==='--delete'){
    borrarDatos()

}

console.log(process.argv)


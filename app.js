const morgan = require('morgan')
const express = require('express');
var app = express();
const ErrorApp = require('./Util/errorApp')
const errorControlador = require('./controladores/errorController');

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

/* ----------Routers Variables-----------
 */
const eventosRouter = require('./rutas/eventosRutas.js')
const usuariosRouter = require('./rutas/usuariosRutas.js')

/* ---------------------Middlewares-----------------*/
app.use(express.json())
app.use((req,res, next) =>{
    console.log("Hello World")
    next()
})
app.use(express.static(`${__dirname}/public`))
app.use((req,res,next) =>{
    req.requestTitme = new Date().toISOString();
    next()
})

/* ---------------------Routers-----------------*/

app.use('/api/v1/eventos',eventosRouter);
app.use('/api/v1/usuarios',usuariosRouter);

// Middlaware que maneja errores de rutas (Manual)

app.all('*', (req,res,next) =>{
    next(new ErrorApp (`Este peticion no existe ${req.originalUrl} en este servidor`, 404))
}) 

app.use(errorControlador)

module.exports = app
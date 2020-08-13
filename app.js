const morgan = require('morgan')
const express = require('express');
var app = express();
const ErrorApp = require('./Util/errorApp')
const errorControlador = require('./controladores/errorController');
const Ratelimit = require('express-rate-limit')
const helmet = require('helmet')
const mongosanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean')
const hpp = require('hpp')
const rateLimit = require('express-rate-limit');
const path = require('path')
const cookieParser = require('cookie-parser')
const multer = require('multer')

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(helmet())

//Saber si esta en modo Desarollo (No tan importante)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

/* ----------Routers Variables-----------
 */
const eventosRouter = require('./rutas/eventosRutas.js')
const usuariosRouter = require('./rutas/usuariosRutas.js');
const reviewRouter = require('./rutas/reviewRutas');
const viewRouter = require('./rutas/viewRutas');
const bookinRouter = require('./rutas/bookingRoutes');
const adminRouter = require('./rutas/admin');

const controlador = require('./controladores/authControlador')

/* ---------------------Middlewares-----------------*/
const limitador = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Demasiadas peticiones, intentalo mas tarde"
})
app.use("/api", limitador)
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended: true, limit:'10kb'}))
app.use(cookieParser())
app.use((req, res, next) => {
    req.requestTitme = new Date().toISOString();
    next()
})

//Evitar trucos con datos de la base de datos
app.use(mongosanitize())

//Evitar problemas con xss
app.use(xssClean())

//Cuidar los querys
app.use(hpp({
    whitelist: ['duracion', 'ratingAvg', 'ratingCantidad', 'maximodePersonas', 'dificultad', 'precio']
}))

app.use('/', viewRouter);
app.use('/admin',adminRouter);
app.use('/api/v1/eventos', eventosRouter);
app.use('/api/v1/usuarios', usuariosRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookinRouter);

// Middlaware que maneja errores de rutas (Manual)

app.all('*', (req, res, next) => {
  const error = 'Pagina no encontrada'
  res.render('error',{

    error:error

  })
    next(new ErrorApp(`Este peticion no existe ${req.originalUrl} en este servidor`, 404))
})

app.use(errorControlador)

module.exports = app
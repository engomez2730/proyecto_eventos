const express = require('express');
const authControlador = require("../controladores/authControlador");
const bookinControlador = require("../controladores/bookinControlador");
const { post } = require('./eventosRutas');





//Rutas del Usuario 
const bookinRouter = express.Router()

bookinRouter.use(authControlador.protegerRutas)

bookinRouter.get('/checkout-session/:eventoId',authControlador.protegerRutas,bookinControlador.getCheckoutSession)

bookinRouter.use(authControlador.poderEntrar('admin','guias'))

bookinRouter.route('/').get(bookinControlador.mostrarTodosBooking).post(bookinControlador.mostrarTodosBooking).delete(bookinControlador.borrarTodoslosBookings)

bookinRouter.route('/:id').get(bookinControlador.mostrarBooking).patch(bookinControlador.actualizarBooking).delete(bookinControlador.borrarBooking)

module.exports = bookinRouter;
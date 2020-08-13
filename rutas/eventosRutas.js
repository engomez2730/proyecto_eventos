const express = require('express');
const eventosControladores = require('./../controladores/eventosControladores')
const authControlador = require("../controladores/authControlador")
const reviewRouter = require("./reviewRutas")



const eventosRouter = express.Router()


//Route Middlaware 
eventosRouter.use('/:eventoId/reviews/', reviewRouter)


//estadisticas
eventosRouter.route('/estadisticas/evento').get(eventosControladores.getEstadisticas)
//Ver los 5 articulos mas vendidos
eventosRouter.route('/top-5-mas-vendidos')
    .get(eventosControladores.mostrarmasVendidos, eventosControladores.mostrarEventos)
//Ver el mes mas ocupado del año
eventosRouter.route('/mes-ocupado/:year')
    .get(authControlador.protegerRutas,
        authControlador.poderEntrar('admin', 'guias'),
        eventosControladores.mesMasOcupado)


eventosRouter.route('/eventos-within/:distancia/centro/:latIng/unit/:unit').get(eventosControladores.verEventoDistancia)
//tours-distance?distance=233,center=-40,45&unit=mi

//Mostrar o crear un Usuario

eventosRouter
    .route('/')
    .get(eventosControladores.mostrarEventos)
    .post(authControlador.protegerRutas,
        authControlador.poderEntrar('admin','guia'),
        eventosControladores.crearEvento)
    .delete(eventosControladores.borrarTodosEventos)


//Mostrar evento
eventosRouter.route('/:id')
    .get(eventosControladores.mostrarevento)

    //editar evento

    .patch(authControlador.protegerRutas,
        authControlador.poderEntrar('admin', 'guia'),
        eventosControladores.subirFotos,
        eventosControladores.ajustarimagenes,
        eventosControladores.actualizarEvento)

    //eliminar evento

    .delete(authControlador.protegerRutas,
        authControlador.poderEntrar('admin'),
        eventosControladores.borrarEvento);

//crear Review

/* eventosRouter.route('/:eventoId/reviews')
    .post(authControlador.protegerRutas,
    authControlador.poderEntrar('usuario'),
    reviewControlador.crearReview
    );

 */

 eventosRouter.route('/subirimagenes', eventosControladores.subirImagenes)

module.exports = eventosRouter
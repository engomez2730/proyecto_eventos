const express = require('express');
const eventosControladores = require('./../controladores/eventosControladores')
const eventosRouter = express.Router()
const authControlador = require("../controladores/authControlador")


/* ---------------------Router Params-----------------*/


/* eventosRouter.param('id', eventosControladores.checkId)
 */
/* ---------------------MAIN-----------------*/


//estadisticas
eventosRouter.route('/estadisticas/evento').get(eventosControladores.getEstadisticas)
//Ver los 5 articulos mas vendidos
eventosRouter.route('/top-5-mas-vendidos')
.get(eventosControladores.mostrarmasVendidos,eventosControladores.mostrarEventos)
//Ver el mes mas ocupado del año
eventosRouter.route('/mes-ocupado/:year').get(eventosControladores.mesMasOcupado)

//Mostrar o crear un Usuario

eventosRouter
.route('/')
.get(authControlador.protegerRutas,eventosControladores.mostrarEventos)
.post(eventosControladores.crearEvento)

//Mostrar, editar o eliminar un Usuario


eventosRouter.route('/:id')
.get(eventosControladores.mostrarevento)
.patch(eventosControladores.actualizarEvento)
.delete(eventosControladores.borrarEvento);

module.exports = eventosRouter
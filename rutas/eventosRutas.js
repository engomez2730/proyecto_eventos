const express = require('express');
const eventosControladores = require('./../controladores/eventosControladores')
const eventosRouter = express.Router()


/* ---------------------Router Params-----------------*/


/* eventosRouter.param('id', eventosControladores.checkId)
 */
/* ---------------------MAIN-----------------*/


eventosRouter.route('/estadisticas/evento').get(eventosControladores.getEstadisticas)

eventosRouter.route('/top-5-mas-vendidos')
.get(eventosControladores.mostrarmasVendidos,eventosControladores.mostrarEventos)

eventosRouter.route('/mes-ocupado/:year').get(eventosControladores.mesMasOcupado)


eventosRouter
.route('/')
.get(eventosControladores.mostrarEventos)
.post(eventosControladores.crearEvento)

/* ---------------------ID-----------------*/

eventosRouter.route('/:id')
.get(eventosControladores.mostrarevento)
.patch(eventosControladores.actualizarEvento)
.delete(eventosControladores.borrarEvento);

module.exports = eventosRouter
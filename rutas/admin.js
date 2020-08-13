const express = require('express');
const viewControlador = require('../controladores/viewControladores')
const authControlador = require('../controladores/authControlador')
const bookinControlador = require('../controladores/bookinControlador')
const adminControlador = require('../controladores/adminControlador');
const { route } = require('./reviewRutas');


const router = express.Router()

router.get('/', authControlador.protegerRutas,authControlador.poderEntrar('admin'), adminControlador.verUsuarios) //ad,in
router.get('/usuarios/:Id', authControlador.protegerRutas,authControlador.poderEntrar('admin'), adminControlador.editarUsuario)//Ver view Eliminar Usuario
router.get('/usuarios/borrar/:Id', authControlador.protegerRutas,authControlador.poderEntrar('admin'), viewControlador.mostrarEliminarUsuario) // Ver form eliminar Usuario
router.get('/crearevento',authControlador.protegerRutas,authControlador.poderEntrar('admin','guia'),viewControlador.crearEvento) //Crear Evento
router.get('/eventos/:Id', authControlador.protegerRutas,authControlador.poderEntrar('admin','guia'),viewControlador.verEventoEditar) //Ver View para eliminar Usuario
router.get('/editareventos',authControlador.protegerRutas,viewControlador.editarEventosVer) //Mostrar Form de eliminarUsuario
router.get('/eventosEliminar/:Id',authControlador.protegerRutas,viewControlador.eliminarEventoEditar) //Elimar Usuario


router.get('/facturas/',authControlador.protegerRutas,viewControlador.verFacturasEventos) //Elimar Usuario
router.get('/eventos/facturas/:Id',authControlador.protegerRutas,viewControlador.verMiembrosFacturas) //Elimar Usuario


router.get('/eventos/vermiembros/:id',authControlador.protegerRutas,viewControlador.verMiembrosGuias) //Elimar Usuario
 








module.exports= router
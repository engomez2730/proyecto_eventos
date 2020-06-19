const express = require('express');
const authControlador = require("../controladores/authControlador");
const usuariosControladores= require('./../controladores/usuariosControladores');
const { post } = require('./eventosRutas');


//Rutas del Usuario 
const usuariosRouter = express.Router()

//Ruta de registrarse
usuariosRouter.post('/registrarse',authControlador.crearUsuario)
usuariosRouter.post('/login',authControlador.login)



//Mostrar o Crear Usuario 
usuariosRouter
.route('/')
.get(usuariosControladores.mostrarUsuarios).post(usuariosControladores.crearUsuario).delete(usuariosControladores.borrarTodosUsuario);
;


//Mostrar, editar o eliminar un Usuario

usuariosRouter
.route('/:id')
.get(usuariosControladores.mostrarUsuario)
.patch(usuariosControladores.editarUsuario)
.delete(usuariosControladores.borrarTodosUsuario);

module.exports = usuariosRouter
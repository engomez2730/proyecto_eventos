const express = require('express');
const usuariosControladores= require('./../controladores/usuariosControladores')


const usuariosRouter = express.Router()

usuariosRouter
.route('/')
.get(usuariosControladores.mostrarUsuarios).post(usuariosControladores.crearUsuario);

usuariosRouter
.route('/:id')
.get(usuariosControladores.mostrarUsuario)
.patch(usuariosControladores.editarUsuario)
.delete(usuariosControladores.borrarUsuario);

module.exports = usuariosRouter
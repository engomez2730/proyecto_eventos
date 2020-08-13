const express = require('express');
const authControlador = require("../controladores/authControlador");
const usuariosControladores = require('./../controladores/usuariosControladores');
const viewControladores = require('./../controladores/viewControladores');
const multer = require('multer')


const upload = multer({dest:'public/img/users'});


//Rutas del Usuario 
const usuariosRouter = express.Router()

usuariosRouter.get('/reiniciarcontrasena/:token',viewControladores.recuperarcontrasena /* authControlador.reiniciarcontrasena */)
usuariosRouter.patch('/reiniciarcontrasena/:token',authControlador.reiniciarcontrasena)



//Ruta de registrarse
usuariosRouter.post('/registrarse', authControlador.crearUsuario)
usuariosRouter.post('/login', authControlador.login)
usuariosRouter.get('/logout', authControlador.logout)

usuariosRouter.post('/olvidarcontrasena', authControlador.olvidarContrasena)
usuariosRouter.patch('/actualizarmyusuario',authControlador.protegerRutas,upload.single('imagen'),usuariosControladores.actualizarMyUsuario)


//proteger todas las rutas con todos los Middlaware
usuariosRouter.use(authControlador.protegerRutas)

usuariosRouter.patch('/actualizarmycontrasena', authControlador.cambiarContrasena)
usuariosRouter.delete('/borrarUsuario', usuariosControladores.borrarUsuario)
usuariosRouter.get('/me',usuariosControladores.getMe,usuariosControladores.mostrarUsuario)

//proteger todas las rutas con todos los Middlaware
/* usuariosRouter.use(authControlador.poderEntrar('admin'))
 */
//Mostrar o Crear Usuario 
usuariosRouter
    .route('/')
    .get(usuariosControladores.mostrarUsuarios)
    .delete(usuariosControladores.borrarTodosUsuario);
;

//Mostrar, editar o eliminar un Usuario

usuariosRouter
    .route('/:id')
    .get(usuariosControladores.mostrarUsuario)
    .patch(usuariosControladores.editarUsuario)
    .delete(usuariosControladores.borrarUsuario);






module.exports = usuariosRouter
const express = require('express');
const viewControlador = require('../controladores/viewControladores')
const authControlador = require('../controladores/authControlador')
const bookinControlador = require('../controladores/bookinControlador')
const multer = require('multer')
const usuariosControladores = require('../controladores/usuariosControladores');
const usuariosRouter = require('./usuariosRutas');




var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/tours')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
  })
  
   
  var upload = multer({ storage: storage })




const router = express.Router()



router.get('/prueba2/:nombre',authControlador.protegerRutas,viewControlador.prueba2)
router.post('/prueba2',authControlador.protegerRutas,upload.array('myFiles',3),viewControlador.pruebaPost2,viewControlador.pruebaPost3)
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/users')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
  })
   
  var upload = multer({ storage: storage })



router.get('/prueba',authControlador.protegerRutas,viewControlador.prueba)
router.post('/prueba',authControlador.protegerRutas,upload.single('myFile'),viewControlador.pruebaPost)
router.get('/crearevento',authControlador.protegerRutas,/* authControlador.poderEntrar('admin','guia'), */viewControlador.crearEvento)
router.get('/login',authControlador.estaLogeado, viewControlador.login)
router.get('/',bookinControlador.crearBookingCheckout,authControlador.estaLogeado, viewControlador.verOverview)
router.get('/eventos/:id',authControlador.estaLogeado,viewControlador.verEvento)
router.get('/me',authControlador.protegerRutas, viewControlador.verCuenta)
router.get('/registrarse',authControlador.estaLogeado, viewControlador.sigup)
router.get('/my-evento',authControlador.protegerRutas, viewControlador.verMysEventos)
router.patch('/actualizarUsuarioAdmin',authControlador.protegerRutas,viewControlador.actualizarUsuario)
router.post('/eliminarUsuarioAdmin',authControlador.protegerRutas,viewControlador.eliminarUsuario)

/* --------------------------------------------------------------------------------------------------------
 */

router.get('/giras',authControlador.protegerRutas,viewControlador.mostrarEventosGiras)
router.get('/eventosdeportivos',authControlador.protegerRutas,viewControlador.mostrarEventosDeportes)
router.get('/excursioneseducativas',authControlador.protegerRutas,viewControlador.mostrarEventosEdutativos)

/* ----------------------------------------------------------------------*/

router.get('/olvidecontrasena',viewControlador.olvidecontrasena)
router.get('/recuperarcontrasena',viewControlador.recuperarcontrasena)

/* ----------------------------------------------------------------------*/

router.get('/subirimagenes', authControlador.protegerRutas,viewControlador.subirImagenes)

/* ----------------------------------------------------------------------*/

router.post('/convertirseenguia',authControlador.protegerRutas,viewControlador.serGuia)
router.get('/convertirseenguia',authControlador.protegerRutas,viewControlador.serGuiaVer)


router.get('/informacion',authControlador.protegerRutas,viewControlador.informacion)
router.get('/index',viewControlador.index)


router.get('/vereventosguia',authControlador.protegerRutas,viewControlador.verEventoGuia)





module.exports= router
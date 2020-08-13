const express = require('express')
const reviewController = require('../controladores/reviewControlador')
const authControlador = require('../controladores/authControlador')

const router = express.Router({ mergeParams: true }) //para poder usar los paramatros de otra ruta


router.use(authControlador.protegerRutas)


router.route('/')
    .get(reviewController.verTodosReviews)
    .post(authControlador.protegerRutas,
    authControlador.poderEntrar('usuario','admin'), 
    reviewController.ponerUssuarioAndEvenosId,
    reviewController.crearReview)


router.route('/:id').patch( authControlador.poderEntrar('usuario','admin'),reviewController.actualizarReview)
router.route('/:id').delete( authControlador.poderEntrar('usuario','admin'),reviewController.borrarReview)
router.route('/:id').get(reviewController.mostrarReview)





module.exports = router;
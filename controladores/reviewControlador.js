const reviewModel = require('../models/reviewsModel')
/* const catchAsync = require("../Util/errorControlador");
 */const factory = require('./factoryControlador')
const Review = require('../models/reviewsModel')


exports.verTodosReviews = factory.mostrarTodos(Review)

exports.ponerUssuarioAndEvenosId = (req, res, next) =>{
    if (!req.body.evento) req.body.evento = req.params.eventoId
    if (!req.body.usuario) req.body.usuario = req.usuario.id
    next()
}

exports.crearReview = factory.crearUno(reviewModel)
exports.borrarReview = factory.borrarUno(reviewModel)
exports.actualizarReview = factory.actualizarUno(reviewModel)
exports.mostrarReview = factory.mostrarUno(reviewModel)


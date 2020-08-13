const catchAsync = require("../Util/errorControlador");
const ErrorApp = require('../Util/errorApp');
const { Model } = require("mongoose");
const { populate } = require("../models/reviewsModel");
const APIfunciones = require('./../Util/apiControladores')


exports.borrarUno = Model => catchAsync(async (req, res, next) => {


    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new ErrorApp("no hay ningun evento con ese id", 404))
    }
    res.status(200).json({
        status: "success",
        datos: {
            data: null
        }
    })

})

exports.actualizarUno = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true // para que los validadores funciones despues de actualizar un documento
    })

    if (!doc) {
        return next(new ErrorApp('No se pudo ', 404))
    }
    res.status(200).json({
        status: "success",  
        datos: {
            doc
        }
    })
})

exports.crearUno = Model => catchAsync(async (req, res, next) => {
    console.log(req.body)
    req.body.guias = req.usuario.id
    const doc = await Model.create(req.body)

    if (!doc) {
        return next(new ErrorApp('No se pudo ', 404))
    }
    res.status(200).json({
        status: "success",
        datos: {
            doc
        }
    })

});

exports.mostrarTodos = (Model)=> catchAsync(async (req, res, next) => {

    let filtro = {};
    if (req.params.eventoId) filtro = { evento: req.params.eventoId }

    const funciones = new APIfunciones(Model.find(filtro), req.query).filter().sort().limitFiels().paginacion()

    const todosEventos = await funciones.query;
    res.status(200).json({
        status: "sucees",
        resultado: todosEventos.length,
        datos: {
            todosEventos
        }
    })
})

exports.mostrarUno = (Model,populateOpciones) => catchAsync(async (req, res, next) => {

    let doc = await Model.findById(req.params.id)

    if(populateOpciones) doc = await Model.findById(req.params.id).populate(populateOpciones)


    if (!doc) {
        return next(new ErrorApp('No hay eventos con ese id ', 404))
    }
    res.status(200).json({
        status: "sucees",
        datos: {
            doc
        }
    })
})
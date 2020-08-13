const mongoose = require('mongoose');
const eventosModel = require('./../models/eventosModel.js')
const bookingModel = require('./../models/bookings')
const catchAsync = require("../Util/errorControlador");
const ErrorApp = require('../Util/errorApp')
const stripe = require('stripe')('sk_test_51H7CHkLrIe3GU2EqTkrVRl3g1JXWKnFuCZfh7lF1tTx9FbB2tCZn2RLwDfQTEwgvocvZIU59GCoLzH3yFAixO0TD00Esf22aWc')
const factory = require('./factoryControlador')
const mongoDb = require('mongodb')
const sendEmail = require('../Util/email');




exports.getCheckoutSession = catchAsync( async(req,res,next) =>{

    const evento = await eventosModel.findById(req.params.eventoId)
    
   const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?evento=${req.params.eventoId}&usuario=${req.usuario.id}&precio=${evento.precio}`,
        cancel_url:`${req.protocol}://${req.get('host')}/eventos/${evento.id}`,
        customer_email:req.usuario.correo,
        client_reference_id: req.params.eventoId,
        line_items:[{
            name:`${evento.nombre}`,
            description:`${evento.summary }`,
            images:['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
            amount: evento.precio * 100,
            currency:'usd',
            quantity:1
        }]
    })

    
    const url = evento.id
    const informacion = '/'
    await new sendEmail(req.usuario,evento,url,informacion).enviarFactura() 


    res.status(201).json({
        status:'suceess',
        session
    })

})




exports.crearBookingCheckout = async (req,res,next) =>{
    const {evento,usuario,precio} = req.query;

    if(!evento && !usuario && !precio) return next()

    await bookingModel.create({evento,usuario,precio})
    const eventoActualizado = await eventosModel.findByIdAndUpdate(evento.id,{$push:{usuarios:[usuario]}})
    res.redirect(req.originalUrl.split('?')[0])

  
}

exports.crearBooking = factory.crearUno(bookingModel)
exports.actualizarBooking = factory.actualizarUno(bookingModel)
exports.mostrarTodosBooking = factory.mostrarTodos(bookingModel)
exports.borrarBooking = factory.borrarUno(bookingModel)

exports.borrarTodoslosBookings = async(req,res,next) =>{
    const bookings = await bookingModel.deleteMany({})

    res.status(201).json({
        status:'success'
    })

}

exports.mostrarBooking = async (req,res,next) =>{

    let evento = await bookingModel.findById(req.params.id).populate('usuario','nombre').populate('evento','nombre precio')


    if (!evento) {
        return next(new ErrorApp('No hay eventos con ese id ', 404))
    }

    res.status(200).json({
        status: "sucees",
        datos: {
            evento
        }
    })

}



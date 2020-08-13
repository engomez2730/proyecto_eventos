const mongoose = require('mongoose');
const slugify = require('slugify');
const usuarioModel = require('./usuariosModel');
const eventosModel = require('./eventosModel');


const bookingsSchema = new mongoose.Schema({

    usuario:{
            type: mongoose.Schema.ObjectId,
            ref: 'Usuarios',
            required:[true,'Una factura debe tener un Usuario']
    },
    evento:{
            type: mongoose.Schema.ObjectId,
            ref: 'Eventos',
            required:[true,'Una factura debe tener un Evento']
   
    },
    precio:{
        type:Number,
        require: true,
        required:[true,'Una factura debe tener un Evento']

    },
    creadoEn:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default: true
    }

})

bookingsSchema.pre(/^find/, function(next){
    this.populate({
        path:'eventos',
        select:'nombre'
    })

 next()
})


const Booking = mongoose.model('Booking',bookingsSchema)

module.exports = Booking
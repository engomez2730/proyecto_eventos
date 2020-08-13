const mongoose = require('mongoose');
const slugify = require('slugify');
const usuarioModel = require('./usuariosModel');


const eventosSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: [true, "Debe tener un nombre"],
        unique: true,
        trim: true,
        maxlength: [40, "Un Tour debe tener menos de 40 caracteres"],
        minlength: [5, "El nombre debe tener mas de 5 palabras"],
        /* validate:[validator.isAlpha, "No puede tener Numeros"]*/
    },
    duracion: {
        type: Number,
        required: [true]
    },
    maximodePersonas: {
        type: Number,
        required: [true]
    },
    Tipo: {
        type: String,
        required: [true],
        enum: {
            values: ["Giras", "Excursiones Educativas", "Eventos Deportivos"],
            mensaje: "Deber tener una categoria "
        },
    },
    slug: {
        String
    },
    eventoSecreto: {
        type: Boolean
    },
    summary: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: [true]
    },
    imagenPrincipal: {
        type: String

    },
    todasLasImagenes: [{
        type: Array
    }
    
    ],
    fechadeCreacion: {
        type: Date,
        default: Date.now()
    },
    diadelTour:[Date]
    ,
    precio: {
        type: Number,
        required: [true, "Debe tener un precio"],
    },
    // Validacion manual
    precioDescuento: {
        type: Number,
        validate: function (val) {
            return val < this.precio
        }
    },
    puntoDeSalida:String,
/*     destino: {
        String
        //GeoJson
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordenadas: [Number],
        direccion: String,
        descripcion: String
    }, */
    paradas:{
        type:Number,
        required:[true,"Un evento debe tener paradas"]
    },
    guiaIdentificacion:{
        type: String

    },
 /*    localizaciones: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordenadas: [Number],
            direccion: String,
            descripcion: String,
            day: Number
        }
    ], */
    usuarios: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuarios'
        }
    ],
    guias:Array,

    destino:String 
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

eventosSchema.index({ localizacionInicial: '2dsphere' })

//virtual Populate
//Permita modelar coleciones dentro de otras sin necesidad de guardarlas ahi o hacer Querys de mas
//En Este caso se esta modelando reviews en la colecion Eventos

/* eventosSchema.virtual('usuarios1', {
    ref: 'Usuarios',
    foreignField: 'evento',
    localField: '_id'
}) */

//modelando guias en la colecion Eventos

/* eventosSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'usuarios',
        select: '-__v'
    })
    next()
}) */

eventosSchema.pre('save',async function(next){
    const guiasPromises = this.guias.map(async id => await usuarioModel.findById(id))
    this.guias =await Promise.all(guiasPromises)
    console.log(guiasPromises)
    next();
})






/* eventosSchema.pre('save',async function(next){
    const guiasAñadidos = this.guias.map(async id => usuarioModel.findById(id))
    this.guias = await Promise.all(guiasAñadidos)
    next()
})
 */

//Documentos Midlaware 

/* eventosSchema.pre('save',function(next){
    this.nombre = this.nombre + "Hola";
    next()
});
 */

//query Middleware

/* eventosSchema.pre(/^find/,function(next){
    this.find({eventoSecreto:{$ne:true}})
    next()

}) */

//pipeline Middleware

/* eventosSchema.pre("aggregate",function(){
    this.pipeline().unshift({$match:{eventoSecreto:{$ne:true}}})
})
 */



const Eventos = mongoose.model('Eventos', eventosSchema)

module.exports = Eventos;
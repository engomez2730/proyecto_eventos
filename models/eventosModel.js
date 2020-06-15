const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')



const eventosSchema = new mongoose.Schema({

    nombre:{
        type: String,
        required:[true,"Debe tener un nombre"],
        unique: true,
        trim: true,
        maxlength:[40, "Un Tour debe tener menos de 40 caracteres"],
        minlength:[5, "El nombre debe tener mas de 5 palabras"],
/*         validate:[validator.isAlpha, "No puede tener Numeros"]
 */    },
    duracion:{
        type: Number,
        required:[true]
    },
    maximodePersonas:{
        type: Number,
        required:[true]
    },
    dificultad:{
        type:String,
        required:[true],
        enum:{
            values:["facil","medio","dificil"],
            mensaje:"Deber ser facil, medio o dificil"
        },
    },
    slug:{
        String
    },
    ratingAvg:{
        type:Number,
        default:4.5,
        min:[1,"El rating debe ser mayor que 1"],
        max:[5,"El rating no puede pasar de 5"]
    },
    eventoSecreto:{
        type: Boolean
    },
    summary:{
        type:String,
        trim:true
    },
    descripcion:{
        type:String,
        trim:true,
        required:[true]
    },
    imagenPrincipal:{
        type:String,
        require:[true]
    },
    todasLasImagenes:[String],
    fechadeCreacion:{
        type:Date,
        default:Date.now()
    },
    diadelTour:[Date],
    precio:{
        type: Number,
        required:[true,"Debe tener un precio"],
    },
    // Validacion Custom
    precioDescuento:{
        type: Number,
        validate: function(val){
            return val < this.precio 
        }
    },
    ratingCantidad:{
        type: Number,
        default: 0
    }

},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
});

eventosSchema.virtual('duracionSemanas').get(function(){
    return this.duracion / 7 ;

});

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



const Eventos = mongoose.model('eventos',eventosSchema)

module.exports = Eventos;
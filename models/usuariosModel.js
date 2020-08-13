const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto');
const { reset } = require('nodemon');
const { strict } = require('assert');



//Usuario Schema- Tabla Usuarios


const UsuariosSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: [true, "Debes ingresar un nombre"],
    },

    correo: {
        type: String,
        required: [true, "debes ingresar un correo"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Introduzca una direcion de email unica"]

    },

    imagen: {
        type: String,
        default: 'default.jpg'
   },

    rol: {
        type: String,
        enum: ['admin', 'guia', 'asistenteGuia', 'usuario'],
        default: 'usuario'

    },
    contrasena: {
        type: String,
        minlength: 8,
        required: [true, "Tiene que elegir una contraseña"],
        max: 50,
        select: false
    },

    confirmarContrasena: {
        type: String,
        required: [true, "Por favor confirme la contraseña"],
        minlength: 8,
        validate: function (el) {
            return el === this.contrasena
        },
        message: "Las contraseñas no coinciden"
    },

    cambiarcontrasena: {

        type: Date,
    },
    contrasenaReiniciarToken: {
        type: String
    },
    contrasenaReiniciarTokenEspira: {
        type: Date
    },
    estado: {
        type: Boolean,
        select: false,
        default: true
    },
    evento: {
        type: mongoose.Schema.ObjectId,
        ref: 'Eventos',
        /* required: [true, "debe tener una puntuacion"] */
    },
    preferencias: {
        type: String,
        required: [true, "Tienes que especificar una prefrencia de Evento"],
        enum: {
            values: ["Giras", "Excursiones Educativas", "Eventos Deportivos"],
            mensaje: "Deber tener una categoria "
        },
    }

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    })



UsuariosSchema.pre('save', async function (next) { // Midlware para empcritar la contraseña
    if (!this.isModified('contrasena')) return next();

    this.contrasena = await bcrypt.hash(this.contrasena, 12); //Empcritar Contraseña

    this.confirmarContrasena = undefined; // Desactivar Confirmar Contraseña
    next()
})
// Funcion para comparar contraseñas empcryptadas, se usa Methods para crear una funcion global
// que este disponible en cualquier query

UsuariosSchema.methods.validarContrasena = async function(nuevaContrasena, contrasenaReal) {

    return await bcrypt.compare(nuevaContrasena, contrasenaReal)

}

// mostrar la hora donde se cambio la contrasena

UsuariosSchema.pre('save', function (next) {
    if (this.isInit('password') || this.isNew) {
        return next()
    }

    this.cambiarcontrasena = Date.now() - 1000
    next()

})

//Validar que la contrasena se cambio antes de que se emitiera el token

UsuariosSchema.methods.cambiarContrasenaDespues = function (JWTTimesUP) {
    if (this.cambiarcontrasena) {
        const cambiarContrasenaSec = parseInt(this.cambiarcontrasena.getTime() / 1000)

        return JWTTimesUP < cambiarContrasenaSec
    }

    return false
};

//cambiar el estao del Usuario

UsuariosSchema.pre(/^find/, function (next) {

    this.find({ estado: { $ne: false } })
    next()

})


//Reiniciar TOken

UsuariosSchema.methods.crearContrasenaReiniciarContrasena = function () {

    const reiniciarToken = crypto.randomBytes(32).toString('hex'); //crear un token aleatorio

    this.contrasenaReiniciarToken = crypto
        .createHash('sha256')
        .update(reiniciarToken)
        .digest('hex'); //encryptar el token

    this.contrasenaReiniciarTokenEspira = Date.now() + 10 * 60 * 1000
    return reiniciarToken

}

const User = mongoose.model('Usuarios', UsuariosSchema)

module.exports = User;
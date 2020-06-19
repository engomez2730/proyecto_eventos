const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')



//Usuario Schema- Tabla Usuarios


const UsuariosSchema = new mongoose.Schema({

    nombre:{
        type: String,
        required:[true, "Debes ingresar un nombre"],
    },

    correo:{
        type: String,
        required:[true,"debes ingresar un correo"],
        unique:true,
        lowercase: true,
        validate: [validator.isEmail, "Introduzca una direcion de email unica"]
        
    },

    imagen:{
        type:String
    },

    contrasena:{
        type:String,
        minlength:8,
        required:[true,"Tiene que elegir una contraseña"],
        max:50,
        select: false
    },

    confirmarContrasena:{
        type:String,
        required:[true,"Por favor confirme la contraseña"],
        minlength: 8,
        validate: function(el){
            return el === this.contrasena
        },
        message: "Las contraseñas no coinciden"
    },

    cambiarcontrasena:{

        type:Date,
    }
        
})



UsuariosSchema.pre('save', async function(next){ // Midlware para empcritar la contraseña
    if(!this.isModified('contrasena')) return next();

    this.contrasena = await bcrypt.hash(this.contrasena,12); //Empcritar Contraseña

    this.confirmarContrasena = undefined; // Desactivar Confirmar Contraseña
    next() 
})
// Funcion para comparar contraseñas empcryptadas, se usa Methods para crear una funcion global
// que este disponible en cualquier query

UsuariosSchema.methods.validarContrasena = async function(nuevaContrasena, contrasenaReal){ 

    return await bcrypt.compare(nuevaContrasena, contrasenaReal)

}

UsuariosSchema.methods.cambiarContrasenaDespues = function(JWTTimesUP){
    if (this.cambiarcontrasena){
        const cambiarContrasenaSec = parseInt(this.cambiarcontrasena.getTime() / 1000)
        console.log("Fecha base de Datos=" + cambiarContrasenaSec, "Tokem =" +JWTTimesUP)
        

        return JWTTimesUP < cambiarContrasenaSec
    }

    return false
};

const User = mongoose.model('Usuarios', UsuariosSchema)

module.exports = User;
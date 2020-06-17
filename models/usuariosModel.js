const mongoose = require('mongoose');
const validator = require('validator')



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
        max:50
    },

    confirmarContrasena:{
        type:String,
        required:[true,"Por favor confirme la contraseña"],
        minlength: 8
    }

})

const User = mongoose.model('Usuarios', UsuariosSchema)

module.exports = User;
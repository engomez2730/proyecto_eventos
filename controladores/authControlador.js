const mongoose = require('mongoose');
const {promisify} = require('util')
const Usuario = require("../models/usuariosModel");
const catchError = require("../Util/errorControlador");
const jwt = require("jsonwebtoken")
const ErrorApp = require('../Util/errorApp');
const { util } = require('prettier');


const entrarToken = id =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN})
}

//Login /Autenticacion con jsonwebtoken

exports.crearUsuario = catchError( async (req, res, next)=>{

    const usuarioNuevo = await Usuario.create(
        {
           nombre:req.body.nombre,
           correo:req.body.correo,
           contrasena:req.body.contrasena,
           confirmarContrasena:req.body.confirmarContrasena,
           cambiarcontrasena:req.body.cambiarcontrasena
        });

    const token = entrarToken(usuarioNuevo._id)
    

    res.status(200).json({
        token,
        status: "success",
        data: {
            user: usuarioNuevo
        }
    })

})

exports.login = catchError(async(req,res,next) =>{

    const {correo,contrasena }  = req.body; // guardar correo y contraseña desde el usuario

    if(!correo || !contrasena){ // Confirmar que el usuario haya introducido la contraseña y el correo
       return next(new ErrorApp("Tiene que escribir una contrasena",400))
    }

    //validar si el correo existe
    const usuario1 = await Usuario.findOne({correo:correo}).select('+contrasena');

    //Validar que  la contraseña es la correcta
    const contraseñaValidada = await usuario1.validarContrasena(contrasena,usuario1.contrasena);

    if(!correo || !contraseñaValidada ){ //Mostrar error al usuario si el correo o la con estan mal
        next(new ErrorApp("La contraseña o el correo no coinciden",401))
    }

    const token = entrarToken(usuario1._id) // Crear token en el usuario logeado


    res.status(200).json({
        status:"Sucess",
        token
    })
})

//Proteger Rutas 

exports.protegerRutas = catchError( async (req,res,next) =>{

    let token;
   
    // Verificar que el usuario haya enviado el Token correctamente mediante Headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ 

        token = req.headers.authorization.split(' ')[1] // Dividir el valor del Header para que quede el String
        // del toquen
    }
    if (!token){
        return next(new ErrorApp("No estas registrado, por favor entrar para poder verlo", 401))
    }
    console.log(token)

    // limpiar y validar el token
    const codigo = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    console.log(codigo)


    const ActualUsuario = await Usuario.findById(codigo.id) // Encontrar el Usuario

    if(!ActualUsuario){ //Verificar si el usuario aun existe
        return next(new ErrorApp ("El usuario ya no existe",401))
    }

    if  (ActualUsuario.cambiarContrasenaDespues(codigo.iat)){ //Verificar si la contrasena se cambio antes o
        //despues del toquen
         return next(new ErrorApp("El usuario cambio la contrasena, intente de nuevo", 401))
     }


     req.usuario1 = ActualUsuario

    next()
    
})





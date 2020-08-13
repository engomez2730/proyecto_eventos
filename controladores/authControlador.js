const mongoose = require('mongoose');
const { promisify } = require('util')
const Usuario = require("../models/usuariosModel");
const catchError = require("../Util/errorControlador");
const jwt = require("jsonwebtoken")
const ErrorApp = require('../Util/errorApp');
const { util } = require('prettier');
const { findOne } = require('../models/usuariosModel');
const sendEmail = require('../Util/email')
const crypto = require('crypto');
const User = require('../models/usuariosModel');
const { use } = require('../rutas/eventosRutas');
const cookie = require('cookie-parser');
const { url } = require('inspector');
const Email = require('../Util/email');


const entrarToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const enviarRespuestayEnviaToken = (usuario, statusCode, res) => {

    const token = entrarToken(usuario._id)
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
        /* httpOnly: false */
    };

    res.cookie('jwt', token, cookieOptions)
    usuario.contrasena = undefined;
    

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            usuario
        }
    })
    
}

//Login /Autenticacion con jsonwebtoken

exports.crearUsuario = catchError(async (req, res, next) => {

    const usuarioNuevo = await Usuario.create(
        {
            nombre: req.body.nombre,
            correo: req.body.correo,
            rol: req.body.rol,
            contrasena: req.body.contrasena,
            confirmarContrasena: req.body.confirmarContrasena,
            cambiarcontrasena: req.body.cambiarcontrasena,
            evento: req.body.evento,
            preferencias: req.body.preferencias,
            imagen: req.body.imagen

        });

        const url = `${req.protocol}://${req.get('host')}/me`
        console.log(req.body)
        console.log(req.files)
        await new sendEmail(usuarioNuevo,url).sendWelcome()


    enviarRespuestayEnviaToken(usuarioNuevo, 201, res)


})

exports.login = catchError(async (req, res, next) => {

    const { correo, contrasena } = req.body; // guardar correo y contraseña desde el usuario

    if (!correo || !contrasena) { // Confirmar que el usuario haya introducido la contraseña y el correo
        return next(new ErrorApp("Tiene que escribir una contrasena o email", 400))
    }

    //validar si el correo existe
    const usuario = await Usuario.findOne({ correo:correo }).select('+contrasena');

    //Validar que  la contraseña es la correcta
    const contraseñaValidada = await usuario.validarContrasena(contrasena,usuario.contrasena);

    if (!correo || !contraseñaValidada) { //Mostrar error al usuario si el correo o la con estan mal
        next(new ErrorApp("La contraseña o el correo no coinciden", 401))
    }

    const token = enviarRespuestayEnviaToken(usuario,201,res)


    res.status(200).json({
        status: "success",
        token
    })
})

exports.logout = (req,res) =>{

    res.cookie('jwt', 'Salir', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({status:'success'})

}

//Proteger Rutas 

exports.protegerRutas = catchError(async (req, res, next) => {

    let token;

    // Verificar que el usuario haya enviado el Token correctamente mediante Headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        token = req.headers.authorization.split(' ')[1] // Dividir el valor del Header para que quede el String
        // del toquen
    }else if(req.cookies.jwt){
        token = req.cookies.jwt
    }
    if (!token) {
/*         return next(new ErrorApp("No estas registrado, por favor entrar para poder verlo", 401))
 */  
        const error = 'Debes Loguearte para ver esto'
        res.render('error',{
            error:error

        })

}
    console.log(token)

    // limpiar y validar el token
    const codigo = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const ActualUsuario = await Usuario.findById(codigo.id) // Encontrar el Usuario

    if (!ActualUsuario) { //Verificar si el usuario aun existe
        return next(new ErrorApp("El usuario ya no existe", 401))
    }

    if (ActualUsuario.cambiarContrasenaDespues(codigo.iat)) { //Verificar si la contrasena se cambio antes o
        //despues del toquen
        return next(new ErrorApp("El usuario cambio la contrasena, intente de nuevo", 401))
    }
    req.usuario = ActualUsuario
    res.locals.usuario= ActualUsuario

    next()

})

//Saber Cuando esta logeado o no 

exports.estaLogeado = async (req, res, next) => {
    

    if(req.cookies.jwt){

        try{

    const codigo = await promisify(jwt.verify)
    (req.cookies.jwt, 
    process.env.JWT_SECRET
    );

    const ActualUsuario = await Usuario.findById(codigo.id) // Encontrar el Usuario

    if (!ActualUsuario) { //Verificar si el usuario aun existe
        return next()
    }

    if (ActualUsuario.cambiarContrasenaDespues(codigo.iat)) { //Verificar si la contrasena se cambio antes o
        //despues del toquen
        return next()
    }
    res.locals.usuario= ActualUsuario
    return next()
    } catch(err){
        return next()
    }
    }
    next()

}


//Permisos

exports.poderEntrar = (...roles) => {

    return (req, res, next) => {
        const rol = roles.includes(req.usuario.rol); //Para saber si un usuario tiene el permiso de ver esta tura
        if (!rol) {
           /*  return next(new ErrorApp("no tienes permiso para ver esto", 403)) */

           const error = 'no tienes permiso para ver esto'
           res.render('error',{
               error:error
           })
        }
        next()
    }
}

exports.olvidarContrasena = catchError(async (req, res, next) => {

    //Validar que el usuario haya introducido un correo para recperar la contrasena
    const user = await Usuario.findOne({ correo: req.body.correo })
    if (!user) {
        return next(new ErrorApp('No hay ningun usuaruio', 404))
    }

    const reiniciarToken = user.crearContrasenaReiniciarContrasena() //crear el token nuevo
    await user.save({ validateBeforeSave: false }) //guardar el token y cuando expira
    //ruta para cambiar la contrasena
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/usuarios/reiniciarcontrasena/${reiniciarToken}`;

    const message = `Olvidaste tu contraseña, Puedes cambiar tu contraseña usando este Token: ${resetUrl}`

    //enviar el Email
    try {
        /*  await sendEmail({
            email: user.correo,
            subject: "Enderson es el papa de Rensi",
            message}) */
    
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/usuarios/reiniciarcontrasena/${reiniciarToken}`;
        console.log(resetUrl)
        const evento = ''
        const informacion =''

        await new sendEmail(user,evento,resetUrl,informacion).reiniciarContrasena() 

        res.status(200).json({
            status: 'success',
            message: 'Se ha enviado un email'
        });

    } catch (err) {
        user.contrasenaReiniciarToken = undefined
        user.contrasenaReiniciarTokenEspira = undefined
        await user.save({ validateBeforeSave: false })
        

        return next(new ErrorApp("Error Enviando el EMail", 500))
    }
})

exports.reiniciarcontrasena = catchError(async (req, res, next) => {

    const tokenEncryptado = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        contrasenaReiniciarToken: tokenEncryptado,
        contrasenaReiniciarTokenEspira: { $gt: Date.now() }
    }
    )

  /*   if (!user) {
        next(new ErrorApp("El Token ha expirado", 400))
    }
 */
    user.contrasena = req.body.contrasena;
    user.confirmarContrasena = req.body.confirmarContrasena;
    user.contrasenaReiniciarToken = undefined;
    user.contrasenaReiniciarTokenEspira = undefined;
    await user.save()

    const token = entrarToken(user.token)

    res.status(200).json({
        status: "success",
        token
      
    })
})


exports.cambiarContrasena = catchError(async (req, res, next) => {

    //Buscar el usuario

    const user = await User.findById(req.usuario.id).select('+contrasena')
   /*  if(!req.body.contrasena){
        return next(new ErrorApp('no ha introducido la clave,',500))
    } */

    if (!(await user.validarContrasena(req.body.contrasena, user.contrasena))) {
        return next(new ErrorApp("La contrasena es incorrecta", 401))
    }


    user.contrasena = req.body.nuevacontrasena;
    user.confirmarContrasena = req.body.confirmarContrasena
    await user.save()

    enviarRespuestayEnviaToken(user, 201, res)


})

/* exports.enviarEmailGuia = async(req,res,next) =>{

    const usuario = req.usuario
    const informacion = req.body.descripcion
    await new sendEmail(usuario,informacion)

    res.status(201).json({
    status:"Success"
    })

    next()

} */

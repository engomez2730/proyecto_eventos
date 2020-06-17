const mongoose = require('mongoose');
const Usuario = require("../models/usuariosModel");
const catchError = require("../Util/errorControlador");
const jwt = require("jsonwebtoken")

//Login /Autenticacion con jsonwebtoken

exports.crearUsuario = catchError( async (req, res, next)=>{

    const usuarioNuevo = await Usuario.create(
        {
           nombre:req.body.nombre,
           correo:req.body.correo,
           contrasena:req.body.contrasena,
           confirmarContrasena:req.body.confirmarContrasena
        });

    const token = jwt.sign({id: usuarioNuevo._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(200).json({
        token,
        status: "success",
        data: {
            user: usuarioNuevo
        }
    })

})



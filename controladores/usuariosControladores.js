const catchAsync = require("../Util/errorControlador");
const mongoose = require('mongoose');
const Usuario = require("../models/usuariosModel")




exports.mostrarUsuarios = catchAsync(  async (req,res, next) =>{

    const todosUsuarios = await Usuario.find({});
        res.status(200).json({
            status:"sucees",
            datos:{
                todosUsuarios
            }
        })    

})

exports.crearUsuario = (req,res) =>{

    res.status(500).json({
        status: "errot",
        mensaje: "No hecho aun,crear usuario"
    })

}

exports.mostrarUsuario = (req,res) =>{

    res.status(500).json({
        status: "errot",
        mensaje: "No hecho aun, mostrar un solo usuario"
    })

}

exports.editarUsuario = (req,res) =>{

    res.status(500).json({
        status: "errot",
        mensaje: "No hecho aun, editar"
    })

}

exports.borrarUsuario = (req,res) =>{

    res.status(500).json({
        status: "error",
        mensaje: "No hecho aun,borrar "
    })

}

exports.borrarTodosUsuario = async (req,res) =>{

    const usuariosBoorados = await Usuario.deleteMany({})

    res.status(200).json({
        status: "Suceess",
        usuariosBoorados: usuariosBoorados.length,
        mensaje: "No hecho aun,borrar "
    })

}

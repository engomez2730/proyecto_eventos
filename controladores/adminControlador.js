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


exports.verPanerl = catchError(async(req,res,next) =>{

    res.status(201).render('adminindex')

})

exports.verUsuarios = catchError(async(req,res,next) =>{

    const usuarios = await Usuario.find()

    const usuariosLength = usuarios.length

    res.status(201).render('adminIndex',{
        titulo:'usuarios',
        usuarios,
        usuariosLength:usuariosLength

    })

})


exports.editarUsuario = catchError(async(req,res,next) =>{

    const usuario = await Usuario.findById(req.params.Id)

    res.status(201).render('usuariosAdmin',{
        titulo:'usuarios',
        usuario
    })

})

exports.editarUsuarioAdmin = catchError(async(req,res,next) =>{

    const usuario = await Usuario.findById(req.params.Id)
    const id = req.params.id
    console.log(req.params.id)

    res.status(201).render('usuariosAdmin',{
        titulo:'usuarios',
        id:id,
        usuario
    })

})
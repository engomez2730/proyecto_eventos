const usuarioModel = require('../models/usuariosModel');
const catchAsync = require('../Util/errorControlador');
const ErrorApp = require('../Util/errorApp');
const factory = require('./factoryControlador');
const sharp = require('sharp')







const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.ajustarImagen = (req,res,next) =>{

  if(req.file) return next()

}


exports.getMe = (req, res, next) => {
  req.params.id = req.usuario.id;
  next();
};

exports.actualizarMyUsuario = catchAsync(async (req, res, next) => {
    console.log(req.file)
    console.log(req.body)

  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorApp(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'nombre', 'correo');
  if (req.file) filteredBody.imagen = req.file.filename;

  // 3) Update user document
  const updatedUser = await usuarioModel.findByIdAndUpdate(req.usuario.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      usuario: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await usuarioModel.findByIdAndUpdate(req.usuario.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.mostrarUsuario = factory.mostrarUno(usuarioModel);
exports.mostrarUsuarios = factory.mostrarTodos(usuarioModel);

// Do NOT update passwords with this!
exports.editarUsuario = factory.actualizarUno(usuarioModel);

exports.borrarUsuario = async (req,res,next) =>{

  const id = req.params.id

  
  const usuario = await usuarioModel.findByIdAndDelete(id)

  res.status(201).json({
    status:'success',
    usuario
  })


}


exports.borrarTodosUsuario = async(req,res,next) =>{
    const Usuarios = await usuarioModel.deleteMany()

    res.status(201).json({
        status:'success',
        data:Usuarios
        
    })
}



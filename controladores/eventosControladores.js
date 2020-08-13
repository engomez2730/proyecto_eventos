const mongoose = require('mongoose');
const multer = require('multer')
const catchAsync = require("../Util/errorControlador");
const eventosModel = require('./../models/eventosModel.js')
const usuarioModel = require('./../models/usuariosModel.js')
const ErrorApp = require('../Util/errorApp')
const factory = require('./factoryControlador')
const sharp = require('sharp')
const Email = require('../Util/email');
const { find } = require('./../models/eventosModel.js');



 
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/img/users');
    },
   filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1];     cb(null, `user-${req.usuario.id}-${Date.now()}.${ext}`);
    }
  });
  
  const storage = multer.memoryStorage()
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ErrorApp('Not an image! Please upload only images.', 400), false);
    }
  };
  
  const subida = multer({
  
      storage:storage,
      fileFilter:multerFilter
  
  })
  
exports.subirFotos = subida.fields([
    {name: 'imagenPrincipal', maxCount:1},
    {name:'todasLasImagenes',maxCount:3}
])


exports.subirImagenExpress = catchAsync(async(req,res,next) =>{

    if(req.files){
        console.log(req.files)
    }


})

exports.ajustarimagenes =  async(req,res,next) =>{

    //ImagenPrincipal

   if(!req.body.imagenPrincipal || !req.body.todasLasImagenes) return next()
   

    req.body.imagenPrincipal = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

    await sharp(req.files.imagenPrincipal[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imagenPrincipal}`);

    //Imagenes
        req.body.todasLasImagenes = [];

        await Promise.all(
            req.files.todasLasImagenes.map(async (file, i) => {
            const filename = `tours-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.todasLasImagenes.push(filename);
            })
        ); 

        next()
};

   


/* subida.array('images', 5)
 */

exports.mostrarmasVendidos = (req, res, next) => {

    req.query.limit = '5'
    req.query.sort = '-ratingAvg,precio'
    req.query.fields = 'nombre,precio,duracion,dificultad,ratingAvg'
    next();
};

/* ---------------------Mostrar todos los eventos-----------------*/


exports.mostrarEventos = factory.mostrarTodos(eventosModel)
/* ---------------------Mostrar solamente el evento selecionado-----------------*/
exports.mostrarevento = factory.mostrarUno(eventosModel, { path: 'usuarios' , fields:'nombre' })

/*---------------------Check content-----------------*/

/*  exports.chequearContenido =(req,res,next)=>{
    if(!req.body.name || !req.body.price)
    return res.status(400).json(
        {
            status:"error",
            mensaje:"falta nombre o precio"
        }
    )    
    next()
} 
 */




/* ---------------------crear Evento----------------*/

exports.crearEvento = async(req,res,next) =>{

    req.body.guias = req.usuario
    req.body.guiaIdentificacion = req.usuario.id

    const evento = await eventosModel.create(req.body);


    const usuarios = await usuarioModel.find({preferencias:'Giras'})

    console.log(usuarios)


    if (!evento) {
        return next(new ErrorApp('No se pudo ', 404))
    }

    res.status(201).json({
        status:'success'
    })

    usuarios.forEach(async el => {

        const url ="/"
        const informacion ="/"
        const evento ="/"
        
        await new Email(el,url,informacion,evento).reiniciarContrasena() 



    })

    








}










/* ---------------------Actualizar evento-----------------*/

exports.actualizarEvento = factory.actualizarUno(eventosModel)
/* ---------------------Borrar Evento-----------------*/


exports.borrarEvento = factory.borrarUno(eventosModel)



exports.borrarTodosEventos = catchAsync(async (req, res, next) => {


    const borrarEventos = await eventosModel.deleteMany({})

    res.status(200).json({
        status: "sucees",
        datos: {
            data: null
        }
    })

})

//Mostrar Estadisticas

exports.getEstadisticas = catchAsync(async (req, res, next) => {


    const estadisticas = await eventosModel.aggregate([
        {
            //Query para elegir que tipo de documentos traera
            $match: { precio: { $gte: 100 } }
        },
        {
            $group: {
                //Diferentes estadisticas del grupo
                _id: { $toUpper: '$dificultad' }, // Puedes divir los documentos en categorias dependiendo la propiedad
                //dificultad precio
                numerodeEventos: { $sum: 1 },
                cantidaddeRating: { $sum: '$ratingCantidad' },
                avgRating: { $avg: '$ratingAvg' },
                avgPrice: { $avg: '$precio' },
                minPrice: { $min: '$precio' },
                maxPrice: { $max: '$precio' }
            }

        },
        {
            $sort: { cantidaddeRating: 1 }
        },

    ])

    res.status(200).json({
        status: "sucees",
        datos: {
            estadisticas
        }
    })

})

//Mostrar el mes que tiene mas Eventos Programados

exports.mesMasOcupado = catchAsync(async (req, res, next) => {


    const year = req.params.year * 1

    const datos = await eventosModel.aggregate([
        {
            $unwind: '$diadelTour' // desglosar en  un areglo todas las fechas en documentos separados
        }, {
            $match: { //query 
                diadelTour: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            },
        },
        {
            $group: { //tipo de informacion para mostrar 
                _id: { $month: '$diadelTour' },
                numerodeEventos: { $sum: 1 },
                eventos: { $push: '$nombre' }
            }
        },
        {
            $addFields: { mes: '$_id' } //cambiarle el nombre a alguna categoria
        },
        {
            $sort: { diadelTour: 1 } //Organizar documentos
        }

    ])
    res.status(200).json({
        mensaje: "Suceess",
        data: {
            datos
        }
    })
})

exports.verEventoDistancia = catchAsync(async (req, res, next) => {
    const { distancia, latIng, unit } = req.params;
    const [lat, lng] = latIng.split(',')
    const radius = unit === 'mi' ? distancia / 3963.2 : distancia / 6378.1

    if (!lat || !lng) {
        return (next(new Error("No tiene coordenadas", 404)))
    }
    console.log(distancia, latIng, unit)

    const evento = await eventosModel.find(
        { localizacionInicial: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } })



    res.status(201).json({
        status: "Sucees",
        resultado: evento.length,
        data: {
            data: evento
        }

    })

})
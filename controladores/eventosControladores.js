const mongoose = require('mongoose');
const APIfunciones = require('./../Util/apiControladores')
const eventosModel = require('./../models/eventosModel.js')

/* const eventos = JSON.parse(fs.readFileSync(`${__dirname}/../data/data/tours-simple.json`));
 */
/* ---------------------Show all events-----------------*/
exports.mostrarmasVendidos=(req,res,next)=>{

    req.query.limit = '5'
    req.query.sort = '-ratingAvg,precio'
    req.query.fields = 'nombre,precio,duracion,dificultad,ratingAvg'
    next();
};

exports.mostrarEventos = async (req,res)=>{

    
    try{

    const funciones = new APIfunciones(eventosModel.find(),req.query).filter().sort().limitFiels().paginacion()
    const todosEventos = await funciones.query;


        res.status(200).json({
            status:"sucees",
            resultado:todosEventos.length,
            datos:{
                todosEventos
            }
        })    
    }catch(err){
        res.status(400).json({
            status:"error",
            mensaje:err
            
        });
    }
}
/* ---------------------Show only one event-----------------*/
exports.mostrarevento = async(req,res)=>{

    try{
        const evento = await eventosModel.findById(req.params.id)
        res.status(200).json({
            status:"sucees",
            datos:{
                evento
            }
        })    
    }catch(err){
        res.status(400).json({
            status:"error",
            mensaje:err
            
        });
    }
}

/*---------------------Check content-----------------*/

 exports.chequearContenido =(req,res,next)=>{
    if(!req.body.name || !req.body.price)
    return res.status(400).json(
        {
            status:"error",
            mensaje:"falta nombre o precio"
        }
    )    
    next()
} 

/* ---------------------create event-----------------*/


const catchAsync = fn =>{
    fn(req,res,next).catch(err=> next(err))
}


exports.crearEvento = catchAsync( async (req,res,next)=>{
    try{

        const nuevoEvento = await eventosModel.create(req.body)
        res.status(200).json({
            status:"sucees",
            datos:{
                nuevoEvento
            }
        })    
    }catch(err){
        res.status(400).json({
            status:"error",
            mensaje:err
            
        });
    }
});

/* ---------------------update event-----------------*/

exports.actualizarEvento = async(req,res)=>{

    try{
        const actualizarEvento = await eventosModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators: true // para que los validadores funciones despues de actualizar un documento
        })
       
        res.status(200).json({
            status:"sucees",
            datos:{
                actualizarEvento
            }
        })    
    }catch(err){
        res.status(400).json({
            status:"error",
            mensaje:err
            
        });
    }
    
    
}

/* ---------------------Delete event-----------------*/


exports.borrarEvento = async(req,res)=>{

    try{
        const borrarEvento = await eventosModel.findByIdAndDelete(req.params.id)
       
        res.status(200).json({
            status:"sucees",
            datos:{
                data:null
            }
        })    
    }catch(err){
        res.status(400).json({
            status:"error",
            mensaje:err
            
        });
    }
    

   
}

exports.getEstadisticas = async (req,res) =>{
    try{

        const estadisticas = await eventosModel.aggregate([
            {
                //Query para elegir que tipo de documentos traera
                $match:{precio: {$gte:100}}
            },
            {
                $group:{
                    //Diferentes estadisticas del grupo
                    _id: {$toUpper:'$dificultad'}, // Puedes divir los documentos en categorias dependiendo la propiedad
                    //dificultad precio
                    numerodeEventos: {$sum: 1},
                    cantidaddeRating: {$sum: '$ratingCantidad'},
                    avgRating: {$avg:'$ratingAvg'},
                    avgPrice: {$avg:'$precio'},
                    minPrice: {$min:'$precio'},
                    maxPrice:{$max:'$precio'}
                }

            },
            {
                $sort:{cantidaddeRating: 1}
            },
           
        ])

        res.status(200).json({
            status:"sucees",
            datos:{
             estadisticas
            }
        })  

    }catch(err){ res.status(400).json({
        status:"error",
        mensaje:err  
    });   
    }
}

exports.mesMasOcupado = async (req, res) =>{

    try{

        const year = req.params.year * 1


        const datos = await eventosModel.aggregate([
            {
                $unwind:'$diadelTour' // desglosar en  un areglo todas las fechas en documentos separados
            },{
                $match:{ //query 
                    diadelTour:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                },
            },
            {
                $group:{ //tipo de informacion para mostrar 
                     _id:{$month:'$diadelTour'},
                     numerodeEventos: {$sum:1},
                     eventos:{$push:'$nombre'}
                }
            },
            {
                $addFields: {mes:'$_id'} //cambiarle el nombre a alguna categoria
            },
            {
                $sort: {diadelTour: 1} //Organizar documentos
            }

            
           
        ])
        res.status(200).json({
            mensaje:"Suceess",
            data:{
                datos
            }
        })
    
    }catch(err){res.status(400).json({
        status:"error",
        mensaje:err  
    });   

    }


}
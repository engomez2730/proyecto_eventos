const eventoModel = require('../models/eventosModel')
const usuarioModel = require('../models/usuariosModel')
const bookingModel = require('../models/bookings')
const catchAsync = require('../Util/errorControlador')
const ErrorApp = require('../Util/errorApp')
const { findByIdAndUpdate } = require('../models/usuariosModel')
const sendEmail = require('../Util/email')




//Evento Pagina Principal
exports.verOverview = catchAsync( async (req,res)=>{

    //Extraer Data de la base de datos
    const eventos = await eventoModel.find()
    res.status(201).render('overview',{
        titulo:'Todos los Eventos',
        eventos
    
    })
})


// ver Evento
exports.verEvento = catchAsync(async (req,res)=>{

    try{
        const evento = await eventoModel.findById(req.params.id).populate({
            path:'usuarios',
            fields:'Nombre foto'
        })
    
        res.status(201).render('evento',{
            titulo:'Evento',
            evento
        })

    }catch(err){
        res.status(404).render('error',{
            titulo:'Algo Salio Mal',
            msg:err
        })
    }
})



exports.login = (req,res) =>{
    res.status(202).render('login',{
        titulo: 'Login'
    })
}

exports.sigup = (req,res) =>{
    res.status(202).render('sigup',{
        titulo: 'Registrarse'
    })
}



exports.verCuenta = (req,res) =>{
    res.status(202).render('cuenta',{
        titulo: 'Tu cuenta'

    })
}



exports.verMysEventos = catchAsync (async(req,res,next) =>{

    const bookings = await bookingModel.find({usuario:req.usuario.id})
    const eventosId = bookings.map(el => el.evento )
    console.log(eventosId)
    const eventos = await eventoModel.find({_id:{$in: eventosId}})

    res.status(200).render('overview',{
        titulo:'Mis Eventos',
        eventos
    })
})


exports.actualizarUsuario = async (req,res,next) =>{

        try{
            const usuario = await usuarioModel.findOneAndUpdate(req.usuario.id,{
                nombre:req.body.nombre,
                correo:req.body.correo,
                rol:req.body.rol
            },{
                new: true,
                runValidators:true
            }
           )       
            res.status(201).json({
                status:'success',
                data:usuario
            })
        }catch(err){
            console.log(err)

        }

}



exports.mostrarEliminarUsuario = async (req,res,next) =>{

    const usuario = await usuarioModel.findById(req.params.Id)

    res.status(201).render('eliminarUsuario',{
        usuario:usuario
    })

}



exports.eliminarUsuario = async (req,res,next) =>{

        try{
            const usuario = await usuarioModel.findOneAndDelete(req.body.id) 
            console.log(usuario) 
            
            res.redirect('/admin')

            res.status(201).json({
                status:'success',
                data:null
            })

        }catch(err){
            console.log(err)
        }

}

exports.crearEvento = (req, res, next)=>{

    const usuario = req.usuario

    if(usuario.rol === 'guia' || 'admin'){
        res.status(202).render('crearEvento',{
            titulo:'Titulo'
        })
    }else{
        res.status(202).render('convertirseEnGuia.pug',
        { titulo:'Titulo',
          usuario:usuario
        } )
    }

}

exports.editarEventosVer = async(req,res,next) =>{

    const eventos = await eventoModel.find({})

    const eventosLength = eventos.length

    res.status(202).render('eventosAdmin',{
        eventos:eventos,
        titulo:'Titulo',
        eventosLength:eventosLength
    })


}

exports.verEventoEditar = async (req,res,next) =>{
    
    const evento = await eventoModel.findById(req.params.Id)
    console.log(evento)

    res.status(202).render('eventosAdminEditar',{
        evento:evento,
        titulo:'Titulo'
    })

    
    
}


exports.eliminarEventoEditar = async (req,res,next) =>{
    
    const evento = await eventoModel.findById(req.params.Id)

    res.status(202).render('eliminarEvento',{
        evento:evento,
        titulo:'Titulo'
    })

    
    
}


exports.mostrarEventosGiras = async (req,res,next) =>{
    
    const eventos = await eventoModel.find({Tipo: 'Giras'})
    console.log(eventos)

    res.status(202).render('giras',{
        eventos:eventos,
        titulo:"Giras"
    })
    
}
exports.mostrarEventosDeportes = async (req,res,next) =>{
    
    const eventos = await eventoModel.find({Tipo: 'Eventos Deportivos'})
    console.log(eventos)

    res.status(202).render('giras',{
        eventos:eventos,
        titulo:"Giras"
    })
    
}
exports.mostrarEventosEdutativos = async (req,res,next) =>{
    
    const eventos = await eventoModel.find({Tipo: 'Excursiones Educativas'})
    console.log(eventos)

    res.status(202).render('giras',{
        eventos:eventos,
        titulo:"Giras"
    })
    
}
exports.olvidecontrasena = async (req,res,next) =>{
    

    res.status(202).render('enviarContrasenaReinicio',{
        titulo:"Reiniciar Contrasena"
    })
    
}
exports.recuperarcontrasena = async (req,res,next) =>{
    const url = req.params.token

    console.log(url)

    res.status(202).render('recuperarContrasena',{
        titulo:"Reiniciar Contrasena",
        url:url
    })
        
}

exports.verFacturasEventos = async (req,res,next) =>{

    const eventos = await eventoModel.find()
    

    res.status(202).render('facturasEventos',{
        titulo:"Facturas",
        eventos:eventos
    })
        
}

exports.verMiembrosFacturas = async (req,res,next) =>{

    const facturas = await bookingModel.find({"evento":`${req.params.Id}`}).populate('usuario')
    console.log(facturas.length)
    const mensaje = "No hay facturas para este evento"
    const facturasLenght = facturas.length

    res.status(202).render('verMiembrosFacturas',{
        titulo:"Facturas",
        facturas:facturas,
        mensaje:mensaje,
        facturasLenght: facturasLenght

    })
        
}

exports.subirImagenes = async (req,res,next) =>{

    const usuario = req.usuario.id

    console.log(usuario)

    res.status(201).render('subirImagenes',{
        titulo:"Subir Imaganes Evento", 
    })



}

exports.prueba = async (req,res,next) =>{

    res.render('form')

}

exports.pruebaPost = async (req,res,next) =>{

    const nombreArchivo = req.file.filename 

    const usuario = await usuarioModel.findByIdAndUpdate(req.usuario.id,{imagen: nombreArchivo})

    res.redirect('/')

}
exports.prueba2 = async (req,res,next) =>{

    const id = req.params.nombre

    res.render('form2',{
        titulo:'Subir Imagenes Evento',
        nombre:id
    })

}

exports.pruebaPost2 = async (req,res,next) =>{


    const areglo = req.files.map(el => el.filename )
    const query = {nombre: req.body.id}

    await eventoModel.findOneAndUpdate(query,{todasLasImagenes:areglo})

    res.redirect('/')

    next()

}   


exports.pruebaPost3 = async (req,res,next) =>{


    const areglo = req.files.map(el => el.filename )
    const areglo2= areglo[0]
    console.log(areglo2)
    const query = {nombre: req.body.id}
    console.log(query)
    

    await eventoModel.findOneAndUpdate(query,{imagenPrincipal:areglo2})

    res.redirect('/')

}   

//Solicitar ser Guia

exports.serGuia =  async (req,res,next) =>{

    const usuario = {
        nombre:req.body.nombre,
        correo:req.body.correo,
        email:req.body.email
    }

    console.log(usuario )

    const descripcion = req.body.descripcion

    const url = '/'

    const evento = 'evento'


    await new sendEmail(usuario,evento,url,descripcion).serGuia()

    res.redirect('/')

    res.status(201).json({
        status:"Success"
    })

}


/* exports.actualizarDatosUsuarios = catchAsync(async (req,res,next) =>{

   const usuarioActualizado = await usuarioModel.findByIdAndUpdate(req.usuario.id,{
       nombre:req.body.nombre,
       correo:req.body.correo
   },
   {
       new:true,
       runValidators: true
   })
   res.status(201).render('cuenta',{
        usuario:usuarioActualizado
   })
}) */



exports.informacion =  async (req,res,next) =>{


    res.status(201).render('info',{
    })

}

exports.index =  async (req,res,next) =>{


    res.render('index')

}

exports.verEventoGuia =  catchAsync(async(req,res,next) =>{

    const usuario = req.usuario.id

    const eventos = await eventoModel.find({guiaIdentificacion:usuario})


    console.log(eventos.length)


    res.render('overview2',{
        eventos
    })

})
exports.serGuiaVer =  catchAsync(async(req,res,next) =>{

    res.status(202).render('convertirseEnGuia.pug',
    { titulo:'Titulo',
    } )

})

exports.verMiembrosGuias =  catchAsync(async(req,res,next) =>{

    let id = req.params.id
    let areglo = id.split(':')
    id = areglo[1]

    const booking = await bookingModel.find({evento:id})

    const usuariosBooking = booking.map(el=> el.usuario)

    const user = usuariosBooking[1]

    console.log(usuariosBooking[0])

    const usuarios = await usuarioModel.find()
    console.log(usuarios[0].id)

    const usuariosFinales = usuarios.filter(el => el.id === user)

    console.log(usuariosFinales)
    

    res.render('verUsuariosEventos',{
    })

})

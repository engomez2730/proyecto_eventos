


exports.checkId = (req, res, next, val)=>{
    console.log(val)
    next();}




exports.mostrarUsuarios = (req,res) =>{

    res.status(500).json({
        status: "errot",
        mensaje: "No hecho aum, mostrar todos los usuarios"
    })

}

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

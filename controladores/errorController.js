const ErrorApp = require("../Util/errorApp")



const errorDesarollo =(err,res) =>{
        res.status(err.statusCode).json({
            error:err,
            status: err.status,
            message: err.message,
            stack:err.stack
        })
    }

    const errorProducion =(err,res) =>{
        if(err.isoperational){
            errorProducion(err,res)
        }else{
            res.status(500).json({
                status: "Error",
                message:"Algo malo"
            })
        }
    }

    const catchErrorDb = (err) =>{
        const message = "Ese Numero de Id es invalido"
        return new ErrorApp(message,404);
    }

    const tokenError = () =>{
        new ErrorApp("Vuelve a entrar",401)
    }
    const TokenExpiredError = () =>{
        new ErrorApp("Vuelve a entrar",401)
    }



module.exports = (err,req,res,next) =>{

    err.statusCode = err.statusCode ||	500;
        err.status = err.status ||	'error';

    if (process.env.NODE_ENV === 'development'){

        let error = {...err}
        errorDesarollo(err,res)
        if(error.name ===  "JsonWebTokenError"){
           error = tokenError()
        }
     
    }
    else if(process.env.NODE_ENV === 'production'){
      
        let error = {...err}
        if(error.name === "CastError") error = catchErrorDb(err)
        catchErrorDb(error,res)
    }

}


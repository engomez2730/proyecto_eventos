
 const ocultarAlerta10 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas10 = (type,msg) =>{
    ocultarAlerta10()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta10,3000)
}   


const reiniciarContrasena = async (email) =>{

    try{
/*         console.log(req.body.params)
 */        const res = await axios({
            method: 'POST',
            url: `http://localhost:3000/api/v1/usuarios/olvidarcontrasena`, 
            data:{
                correo:email
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas10('success',"Revise su correo para reiniciar la Contraseña")
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }

    }catch(err){
        mostrarAlertas10('error',`${err.response.data.message}`)
 
        console.log(err)
    }
    
}


const reiniciarContrasenaBoton = document.querySelector('.form--reiniciar')

if(reiniciarContrasenaBoton) 
reiniciarContrasenaBoton.addEventListener('submit', e =>{
    e.preventDefault();
    const email = document.getElementById('email').value
    console.log(email)
    reiniciarContrasena(email)
})



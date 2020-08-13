
 const ocultarAlerta11 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas11 = (type,msg) =>{
    ocultarAlerta11()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta11,3000)
}   


const recuperarContrasena = async (token,nuevaContrasena,confirmarContrasena) =>{

    try{
/*         console.log(req.body.params)
 */        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/usuarios/reiniciarcontrasena/${token}`, 
            data:{
                contrasena:nuevaContrasena,
                confirmarContrasena:confirmarContrasena
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas11('success',"Se cambio la contrasena")
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }

    }catch(err){
        mostrarAlertas11('error',`${err.response.data.message}`)
 
        console.log(err)
    }
    
}


const recuperarContrasenaBoton = document.querySelector('.form--recuperar-contrasena')

if(recuperarContrasenaBoton) 
recuperarContrasenaBoton.addEventListener('submit', e =>{
    e.preventDefault();
    const token = document.getElementById('token').value
    const nuevaContrasena = document.getElementById('nuevaContrasena').value
    const confirmarContrasena = document.getElementById('confirmarContrasena').value
    console.log(token,nuevaContrasena,confirmarContrasena)
    recuperarContrasena(token,nuevaContrasena,confirmarContrasena)
})



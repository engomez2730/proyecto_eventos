const ocultarAlerta8 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas8 = (type,msg) =>{
    ocultarAlerta8()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta8,3000)
}   



 const actualizarContrasena = async(contrasena,nuevaContrasena,confirmarContrasena) =>{

    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/usuarios/actualizarmycontrasena', 
            data:{
                contrasena:contrasena,
                nuevacontrasena:nuevaContrasena,
                confirmarContrasena:confirmarContrasena

            }
        })

        if(res.data.status === 'success'){
            mostrarAlertas8('success',"Contraseña Actualizada")
            window.setTimeout(() => {
                location.assign('/me');
              }, 1500);
        }
        

    }catch(err){

        mostrarAlertas8('error',err.response.data.message)
        console.log(err)
    }

    }





const contrasenaBoton = document.querySelector('.form-contrasena')

if(contrasenaBoton)

    contrasenaBoton.addEventListener('submit', e =>{
            e.preventDefault()
            const contrasena = document.getElementById('contrasena').value;
            const nuevaContasena = document.getElementById('nuevaContasena').value;
            const confirmarContrasena = document.getElementById('confirmarContrasena').value;
            actualizarContrasena(contrasena,nuevaContasena,confirmarContrasena)
        })
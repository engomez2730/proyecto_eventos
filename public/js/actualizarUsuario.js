const ocultarAlerta2 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas1 = (type,msg) =>{
    ocultarAlerta2()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta2,3000)
}   

 const usuarioActualizado = async(nombre,correo,imagen) =>{

    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/api/v1/usuarios/actualizarmyusuario', 
            data:{
                nombre:nombre,
                correo: correo,
                imagen:imagen
            }
        })

        console.log(imagen)

        if(res.data.status === 'success'){
            mostrarAlertas1('success',"Usuario Actualizado")
            window.setTimeout(() => {
                location.assign('/me');
              }, 1500);
        }
        

    }catch(err){

        mostrarAlertas1('error',err.response.data.message)
    }

    }





const actualizarmyusuarioBoton = document.querySelector('.form-user-data')

if(actualizarmyusuarioBoton)

    actualizarmyusuarioBoton.addEventListener('submit', e =>{
            e.preventDefault()
            const nombre = document.getElementById('name').value;
            const correo = document.getElementById('email').value;
            const imagen = document.getElementById('photo').file;
            console.log(imagen)
            
            usuarioActualizado(nombre,correo,imagen)
        })
    

 const ocultarAlerta = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas = (type,msg) =>{
    ocultarAlerta()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta3,3000)
}   

const usuarioActualizado = async(nombre,correo,rol) =>{

    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:3000/actualizarUsuarioAdmin', 
            data:{
                nombre,
                correo,
                rol
            }
        })


        if(res.data.status === 'success'){
/*             mostrarAlertas('success',"Usuario Actualizado")
 */         window.setTimeout(()=>{
                location.assign('/admin')
            },1500)
        }


    }catch(err){
        console.log(err)

    }

}

const actualizarmyusuarioBoton = document.querySelector('.form-user-data')

if(actualizarmyusuarioBoton)

    actualizarmyusuarioBoton.addEventListener('submit', e =>{
            e.preventDefault()
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const rol = document.getElementById('rol').value;
            console.log(rol)
            
            usuarioActualizado(nombre,correo,rol)
        })
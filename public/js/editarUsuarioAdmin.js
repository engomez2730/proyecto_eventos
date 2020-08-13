
 const ocultarAlerta89 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas89 = (type,msg) =>{
    ocultarAlerta89()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta89,3000)
}   

const usuarioActualizadoAdmin = async(nombre,correo,rol,id) =>{

    try{
        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/usuarios/${id}`, 
            data:{
                nombre:nombre,
                correo:correo,
                rol:rol
            }
        })


        if(res.data.status === 'success'){
        window.setTimeout(()=>{
                location.assign('/admin')
            },1500)
        }


    }catch(err){
        console.log(err)

    }

}

const usuarioActualizadoAdminBoton = document.querySelector('.form--editarUsuario')

if(usuarioActualizadoAdminBoton)

    usuarioActualizadoAdminBoton.addEventListener('submit', e =>{
            e.preventDefault()
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const rol = document.getElementById('rol').value;
            const id = document.getElementById('id').value;

            console.log(rol,nombre,correo,id)
            
            usuarioActualizadoAdmin(nombre,correo,rol,id)
        })

 const ocultarAlerta3 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas3 = (type,msg) =>{
    ocultarAlerta3()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta3,3000)
}   


const signup = async (nombre,correo,contrasena,confirmarContrasena,preferencias) =>{

    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/usuarios/registrarse', 
            data:{
                nombre,
                correo,
                contrasena,
                confirmarContrasena,
                preferencias
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas3('success',"Te has registrado correctamente")
            window.setTimeout(()=>{
                location.assign('/prueba')
            },1500)
        }

    }catch(err){
        if(err.response.data.message === 'self signed certificate in certificate chain')
        mostrarAlertas3('success','Te has registrado correctamente')
        window.setTimeout(()=>{
            location.assign('/')
        },1500)

    }
    
}


const signupBoton = document.querySelector('.form--signup')
if(signupBoton)
    signupBoton.addEventListener('submit', e =>{
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const contrasena = document.getElementById('contrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;
        const preferencias = document.getElementById('preferencias').value;
        console.log(nombre,correo,contrasena,confirmarContrasena,preferencias)
        signup(nombre,correo,contrasena,confirmarContrasena,preferencias)

    })



 

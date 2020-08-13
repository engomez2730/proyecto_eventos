
 const ocultarAlertad = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas = (type,msg) =>{
    ocultarAlertad()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlertad,3000)
}   


const login = async (email,password) =>{

    
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/usuarios/login', 
            data:{
                correo: email,
                contrasena:password
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas('success',"Login in")
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }

    }catch(err){
        if(err.response.data.message === "Cannot read property 'validarContrasena' of null"){
            mostrarAlertas('error',"No tenemos ninguna cuenta registrada con ese correo")
            console.log(err.response.data.message)
        }else{
            mostrarAlertas('error',err.response.data.message)

        }
    }
}

const botonLogin = document.querySelector('.form--login')

if(botonLogin)
    botonLogin.addEventListener('submit', e =>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email,password)
    
    })





 


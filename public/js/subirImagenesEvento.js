
 const ocultarAlerta25 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas25 = (type,msg) =>{
    ocultarAlerta25()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta25,3000)
}   


const subirImagenes = async (imagenPrincipal,todasLasImagenes) =>{

    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/eventos/subirimagenes', 
            data:{
                imagenPrincipal:imagenPrincipal,
                todasLasImagenes:todasLasImagenes
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas25('success',"Evento creado con exito")
            window.setTimeout(()=>{
                location.assign('/admin/subirimagenes')
            },1500)
        }

    }catch(err){
     /*    mostrarAlertas25('success','Te has registrado correctamente')
        window.setTimeout(()=>{
            location.assign('/')
        },1500)
 */
        console.log(err)
    }
    
}


const subirImagenesBoton = document.querySelector('.form-subirImagenes')
if(subirImagenesBoton)
    subirImagenesBoton.addEventListener('submit', e =>{
        e.preventDefault();
        const imagenPrincipal = document.getElementById('imagenPrincipal').files;
        const todasLasImagenes = document.getElementById('todasLasImagenes').files;

        console.log(req.files)
        subirImagenes(imagenPrincipal,todasLasImagenes)

    })



 

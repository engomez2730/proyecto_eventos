
 const ocultarAlerta6 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas6 = (type,msg) =>{
    ocultarAlerta6()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta6,3000)
}   


const eliminarEvento = async (id) =>{

    try{
/*         console.log(req.body.params)
 */        const res = await axios({
            method: 'DELETE',
            url: `http://localhost:3000/api/v1/eventos/${id}`, 
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas6('success',"Evento eliminado con exito")
            window.setTimeout(()=>{
                location.assign('/admin/editarEventos')
            },1500)
        }

    }catch(err){
        mostrarAlertas6('error',`${err.response.data.message}`)
 
        console.log(err)
    }
    
}


const eliminarEventoBoton = document.querySelector('.myBtnEliminar')

if(eliminarEventoBoton) 
eliminarEventoBoton.addEventListener('submit', e =>{
    e.preventDefault();
    const id = document.getElementById('idSpan').value
    console.log(id)
    eliminarEvento(id)
})



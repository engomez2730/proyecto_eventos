
 const ocultarAlerta5 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas5 = (type,msg) =>{
    ocultarAlerta5()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta5,3000)
}   


const actializarEvento = async (id,nombre,duracion,diadelTour,maximodePersonas,Tipo,precio,summary,descripcion,paradas,destino,puntoDeSalida) =>{

    try{
/*         console.log(req.body.params)
 */        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/eventos/${id}`, 
            data:{
                nombre:nombre,
                duracion:duracion,
                diadelTour:diadelTour,
                maximodePersonas:maximodePersonas,
                Tipo:Tipo,
                precio:precio,
                summary:summary,
                descripcion:descripcion,
                paradas:paradas,
                destino:destino,
                puntoDeSalida:puntoDeSalida
            },
            withCredentials: true,
        })

        if(res.data.status === 'success'){
            mostrarAlertas5('success',"Evento creado con exito")
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }

    }catch(err){
        mostrarAlertas5('error',`${err.response.data.message}`)
 
        console.log(err)
    }
    
}




const actializarEventoBoton = document.querySelector('.form-actializarEvento')
if(actializarEventoBoton)
    actializarEventoBoton.addEventListener('submit', e =>{
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const duracion = document.getElementById('duracion').value;
        const diadelTour = document.getElementById('diadelTour').value;
        const maximodePersonas = document.getElementById('maximodePersonas').value;
        const Tipo = document.getElementById('Tipo').value;
        const precio = document.getElementById('precio').value;
        const summary = document.getElementById('summary').value;
        const paradas = document.getElementById('paradas').value;
        const destino = document.getElementById('destino').value;
        const puntoDeSalida = document.getElementById('puntoDeSalida').value;
        const descripcion = document.getElementById('descripcion').value
        const id = document.getElementById('idSpan').value

        console.log(id)


        actializarEvento(id,nombre,duracion,diadelTour,maximodePersonas,Tipo,precio,summary,descripcion,paradas,destino,puntoDeSalida)
    })



 


 const ocultarAlerta4 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertas4 = (type,msg) =>{
    ocultarAlerta4()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlerta4,3000)
}   


const crearEvento = async (nombre,duracion,diadelTour,maximodePersonas,Tipo,precio,summary,descripcion,paradas,destino,puntoDeSalida) =>{

    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/eventos/', 
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
            mostrarAlertas4('success',"Evento creado con exito")
            window.setTimeout(()=>{
                location.assign(`/prueba2/${nombre}`)
            },1500)
        }

    }catch(err){
     /*    mostrarAlertas4('success','Te has registrado correctamente')
        window.setTimeout(()=>{
            location.assign('/')
        },1500)
 */
        console.log(err)
    }
    
}


const crearEventoBoton = document.querySelector('.form-crearevento')
if(crearEventoBoton)
    crearEventoBoton.addEventListener('submit', e =>{
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const duracion = document.getElementById('duracion').value;
        const diadelTour = document.getElementById('diadelTour').value;
        const maximodePersonas = document.getElementById('maximodePersonas').value;
        const Tipo = document.getElementById('Tipo').value;
        const precio = document.getElementById('precio').value;
        const summary = document.getElementById('summary').value;
        const descripcion = document.getElementById('descripcion').value;
        const paradas = document.getElementById('paradas').value;
        const destino = document.getElementById('destino').value;
        const puntoDeSalida = document.getElementById('puntoDeSalida').value;
        console.log(nombre,duracion,diadelTour,maximodePersonas,Tipo,precio,summary,descripcion,paradas,destino,puntoDeSalida)
        crearEvento(nombre,duracion,diadelTour,maximodePersonas,Tipo,precio,summary,descripcion,paradas,destino,puntoDeSalida)

    })



 

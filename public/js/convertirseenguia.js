
 const ocultarAlertaDelete4 = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertasDelete4 = (type,msg) =>{
    ocultarAlertaDelete4()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlertaDelete43,3000)
}   

const convertirseGuia = async(descripcion,correo,id,nombre) =>{

    try{
        const res = await axios({
            method: 'POST',
            url: `http://localhost:3000/convertirseenguia`, 
            data:{
                descripcion,
                correo,
                nombre,
                id
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

const convertirseGuiaBoton = document.querySelector('.form--convertirse-guia')

if(convertirseGuiaBoton)

    convertirseGuiaBoton.addEventListener('submit', e =>{
            e.preventDefault()
            const descripcion = document.getElementById('descripcion').value;
            const id = document.getElementById('id').value;
            const correo = document.getElementById('correo').value;
            const nombre = document.getElementById('nombre').value;
            convertirseGuia(descripcion,id,correo,nombre )
        })
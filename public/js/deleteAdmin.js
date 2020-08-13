
 const ocultarAlertaDelete = () =>{
    const el = document.querySelector('.alert')
    if (el) el.parentElement.removeChild(el)
}

 const mostrarAlertasDelete = (type,msg) =>{
    ocultarAlertaDelete()
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup)
    window.setTimeout(ocultarAlertaDelete3,3000)
}   

const usuarioBorrado = async(id) =>{

    try{
        const res = await axios({
            method: 'DELETE',
            url: `http://localhost:3000/api/v1/usuarios/${id}`, 
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

const actualizarmyusuarioBotonDelete = document.querySelector('.form-user-delete')

if(actualizarmyusuarioBotonDelete)

    actualizarmyusuarioBotonDelete.addEventListener('submit', e =>{
            e.preventDefault()
            const id = document.getElementById('id').value;
            console.log(id)
            usuarioBorrado(id)
        })
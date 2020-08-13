

logout = async () =>{
    try{
        const res = await axios({
            method: 'GET',
            url:'http://localhost:3000/api/v1/usuarios/logout',
        });
        if(res.data.status = 'success') {
            window.setTimeout(()=>{
                location.assign('/')
            },1500)
        }
    }catch(err){
        alert('Algo Salio mal')
    }   
}


document.querySelector('.salir').addEventListener('click',logout)
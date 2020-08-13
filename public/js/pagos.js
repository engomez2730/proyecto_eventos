 const Stripe1 = Stripe('pk_test_51H7CHkLrIe3GU2EqzwfNj6QFm640VBB8jFlblTObRfgGitbiXrFOFslxXB92Q0Rf2G5dYRJoGh3DOsZeik5eOVzW00OJqRaF1D')

const comprarEvento = async eventoId =>{
  
    try{
        const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${eventoId}`)
        console.log(session)

        await Stripe1.redirectToCheckout({
            sessionId:session.data.session.id
        })
    




    }catch(err){
        console.log(err)
    }


};

const botonPagos = document.getElementById('book-tour')

botonPagos.addEventListener('click', e=>{
    e.target.textContent = 'Procesando....'
    const eventoId = e.target.dataset.eventoId
    comprarEvento(eventoId)
})



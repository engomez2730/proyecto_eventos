const nodemailer = require('nodemailer')
const { options } = require('../rutas/eventosRutas')
const pug = require('pug')
const htmlToText = require('html-to-text')



module.exports = class Email {
    constructor(usuario,evento,url,informacion) {
        
        this.to=usuario.correo;
        this.eventoNombre=evento.nombre
        this.eventoPrecio=evento.precio  
        this.nombre= usuario.nombre
        this.eventoDia = evento.diaDelTour
        this.url= url
        this.informacion = informacion
        this.correo1 = usuario.email
        this.from= `Enderson Gomez <${process.env.EMAIL_FROM}>`


    }

    newTransport(){
        if(process.env.NODE_ENV === 'producion'){
        return 1;   
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
         user: process.env.EMAIL_USERNAME,
         pass: process.env.EMAIL_PASSWORD,
 
        }
    })
}

async send(template, subject){

    //crear Pug Template
    const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
        nombre: this.nombre,
        url:this.url,
        evento:this.eventoNombre,
        precio:this.eventoPrecio,
        eventoDia:this.eventoDia,
        informacion:this.informacion,
        correo:this.correo1,
        subject

    });


    //Definir Opciones del Email

    const mailOptions = {
        from: this.from,
        to:this.to,
        subject,
        html,
        text: htmlToText.fromString(html)
    };

/*     this.newTransport()
 */    await this.newTransport().sendMail(mailOptions)
}

   async sendWelcome(){
      await  this.send('welcome', "Bienvenidos a EventosRD")
    }

   async reiniciarContrasena(){
        await  this.send('reiniciarContrasena', "Reinicia tu Contraseña, (Solo tienes 10 Minutos)")
    }

   async enviarFactura(){
        await  this.send('enviarFactura', "Recibo de Pago")
    }

    async serGuia(){
        await  this.send('serGuia', "Solicitu de Guia")
    }


}




/* const sendEmail = async options =>{

   const transporter = nodemailer.createTransport({
       host: process.env.EMAIL_HOST,
       port: process.env.EMAIL_PORT,
       auth:{
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,

       }
   })

   const mailOptions = {
       from: 'Enderson Gomez <enderson@gmail.com>',
       to:options.email,
       subject: options.subject,
       text: options.message
   };

   await transporter.sendMail(mailOptions)

}

module.exports = sendEmail */
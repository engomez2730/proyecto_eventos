const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Un Review debe tener un review"]
        },
        puntuacion: {
            type: Number,
            required: [true, "Un Review debe tener una puntuacion"],
            min: 1,
            max: 5
        },
        diadeCreacion: {
            type: Date,
            default: Date.now
        },
        evento: {
            type: mongoose.Schema.ObjectId,
            ref: 'Eventos',
            required: [true, "Un Review debe tener una puntuacion"]
        },
        usuario: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuarios',
            required: [true, "Un Review debe tener una puntuacion"]

        }

    },

    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)



// Modelar los Usuarios a la colecion de Reviews
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'usuario',
        select: '-correo -rol -__v '
    })
    next()
})

reviewSchema.static.calcularRaingAvg = async function (eventoId) {
    const stadisticas = await this.aggregate([
        {
            $match: { $evento: eventoId }
        },
        {
            $group: {
                _id: '$evento',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$puntuacion' }
            }
        }
    ])
}

reviewSchema.post('save', function () {

    this.constructor.calcularRaingAvg(this.evento)

})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
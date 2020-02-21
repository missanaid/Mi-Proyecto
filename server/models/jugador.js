const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values: ['PRO_ROLE', 'PLAYER_ROLE'],
    message: '{VALUE} no es un rol válido'
};
let Schema = mongoose.Schema;


let jugadorSchema = new Schema({

    nombre: {
        type: String,
        required: [true, '¡El nombre es obligatorio!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, '¡El email es obligatorio!']
    },
    password: {
        type: String,
        required: [true, '¡La contraseña es obligatoria!']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'PLAYER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    nick: {
        type: String,
        required: false
    },
    juegosAdquiridos: {
        type: String,
        required: false
    },
    horasDeJuego: {
        type: String,
        required: false

    }
});

jugadorSchema.methods.toJSON = function() {
        let player = this;
        let playerObject = player.toObject();
        delete playerObject.password;

        return playerObject;
    }
    //Validador del email, {PATH} se refiere al campo en donde se implementó
jugadorSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único!' });

module.exports = mongoose.model('Jugador', jugadorSchema);
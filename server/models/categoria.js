const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    jugador: { type: Schema.Types.ObjectId, ref: 'Jugador' }
});


module.exports = mongoose.model('Categoria', categoriaSchema);
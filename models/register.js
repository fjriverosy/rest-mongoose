var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerSchema = new Schema({
    dni: String,
    nombre: String,
    entrada: String,
    salida: String
});
registerSchema.index({nombre : 'text'}); // se crea un index para apuntar la busqueda al interior de los nombres.
var Register = mongoose.model('Register', registerSchema);
module.exports = Register;
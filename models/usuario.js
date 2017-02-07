module.exports = (app) => {
  var db = require('../lib/db_connect')();
  var Schema = require('mongoose').Schema;

  var contato  = new Schema({
    nome: String,
    email: String
  });
  var usuario = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true, index: {unique: true}}, //{unique: true} cria um atributo unico semelhante no SQL
    contatos: [contato]
  });

  return db.model('usuario', usuario);
}

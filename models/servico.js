// Load required packages
var mongoose = require('mongoose');

// Define our servico schema
var ServicoSchema   = new mongoose.Schema({
  foto: String,
  thumb: String,
  lat: String,
  lng: String,
  endereco: String,
  desc: String,
  data: String,
  iduser: String,
  status: String
});

// Export the Mongoose model
module.exports = mongoose.model('Servico', ServicoSchema);
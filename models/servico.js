// Load required packages
var mongoose = require('mongoose');

// Define our servico schema
var ServicoSchema   = new mongoose.Schema({

  foto: { type: String, required: true },
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  desc: { type: String, required: true },
  data: { type: Date, required: true},
  cidade: { type: String, index: true, required: true },
  bairro: { type: String, default: null },
  rua: { type: String, default: null },
  status: { type: String, default: 'novo' },
  _idUser: { type: String, require: true, index: true },

});

// Export the Mongoose model
module.exports = mongoose.model('Servico', ServicoSchema);
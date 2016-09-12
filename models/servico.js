// Load required packages
var mongoose = require('mongoose');

// Define our servico schema
var ServicoSchema   = new mongoose.Schema({

  filePath: { type: String, default: null},
  latlng: { type: String, required: true },
  desc: { type: String, required: true },
  data: { type: Date, required: true},
  estado: { type: String, index: true, required: true },
  cidade: { type: String, index: true, required: true },
  bairro: { type: String, default: null },
  rua: { type: String, default: null },
  endereco: { type: String, default: null },
  status: { type: String, default: 'novo' },
  _idUser: { type: String, require: true, index: true }

});

// Export the Mongoose model
module.exports = mongoose.model('Servico', ServicoSchema);
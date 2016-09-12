// Load required packages
var Servico = require('../models/servico');
//var multer  = require('multer');

// Create endpoint /api/servicos for POST
exports.postServico = function (req, res) {
  // Create a new instance of the Servico model
  var servico = new Servico();
  // Set the servico properties that came from the POST data
  servico.filePath = req.body.filePath;
  servico.endereco = req.body.endereco;
  servico._idUser = req.body._idUser;
  servico.latlng = req.body.latlng;
  servico.status = req.body.status;
  servico.estado = req.body.estado;
  servico.cidade = req.body.cidade;
  servico.bairro = req.body.bairro;
  servico.desc = req.body.desc;
  servico.data = req.body.data;
  servico.rua = req.body.rua;

  // Save the servico and check for errors
  servico.save(function (err) {
    if (err)
      return res.send(err);
   return res.json({ message: 'postServicoSuccess', servico: servico });
  });
};

exports.getServicos = function (req, res) {

   Servico.find(function (err, servico) {
     if (err)
       return res.send(err);
     if (!servico)
       return res.json({ message: 'noservico' });
 
     // Success
     return res.json({ message: 'success', servico: servico });
 
   });
};





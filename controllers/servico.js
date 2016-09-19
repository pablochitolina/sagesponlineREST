// Load required packages
var Servico = require('../models/servico');
//var multer  = require('multer');

// Create endpoint /api/servicos for POST
exports.postServico = function (req, res) {
  // Create a new instance of the Servico model
  var servico = new Servico();
  // Set the servico properties that came from the POST data
  servico.filename = req.body.filename;
  servico.endereco = req.body.endereco;
  servico.iduser = req.body.iduser;
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

  Servico.find({ status: req.headers.status, iduser: req.headers.iduser},function (err, servicos) {
     if (err)
       return res.send(err);
     if (!servicos)
       return res.json({ message: 'noservico' });
 
     // Success
     return res.json({ message: 'success', servicos: servicos });
 
   });
};

exports.getImagem = function (req, res) {
  
  var options = {
    root: __dirname + '/../uploads/'
  };

  var fileName = req.params.imagename;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    
  });


};

//Edita descricao servico
exports.putServicoDescricao = function (req, res) {

  Servico.findById(req.body.idservico , function (err, servico) {
    if (err)
      return res.send(err);
    if (!servico)
      return res.json({ message: 'noservico' });

    //servico.email = req.body.email;//apenas em DEV, PRD não muda email
    servico.desc = req.body.desc;
    servico.save();

    res.json({ message: 'putServDescSuccess', servico: servico });

  });

};

exports.deleteServico = function(req, res) {
  
  Servico.remove({_id: req.headers.idservico} , function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'deleteServicoSuccess' });
  });
};







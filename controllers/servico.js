// Load required packages
var Servico = require('../models/servico');
//var multer  = require('multer');

// Create endpoint /api/servicos for POST
exports.postServicos = function (req, res) {
  // Create a new instance of the Servico model
  var servico = new Servico();
  // Set the servico properties that came from the POST data
  servico.foto = req.body.foto;
  servico.lat = req.body.lat;
  servico.lng = req.body.lng;
  servico.desc = req.body.desc;
  servico.data = req.body.data;
  servico.cidade = req.body.cidade;
  servico.bairro = req.body.bairro;
  servico.rua = req.body.rua;
  servico.status = req.body.status;
  servico._idUser = req.body._idUser;

  // Save the servico and check for errors
  servico.save(function (err) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', data: servico });
  });
};

exports.postServicosImage = function (req, res) {

  /* var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  var upload = multer({ storage: storage });

  upload.single('foto');
  console.log("ok multer");*/
  // Create a new instance of the Servico model
};


// Create endpoint /api/servicos for GET
exports.getServicos = function (req, res) {
  // Use the Servico model to find all servico
  Servico.find({ _idUser: req.body._idUser }, function (err, servicos) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', servico: servico });
  });
};

// Create endpoint /api/servicos/:servico_id for GET
exports.getServico = function (req, res) {
  // Use the Servico model to find a specific servico
  Servico.findOne({ _idUser: req.headers._idUser, _id: req.headers._idServico }, function (err, servico) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', servico: servico });
  });
};

//FAZER
// Create endpoint /api/servicos/:servico_id for PUT
exports.putServico = function (req, res) {
  // Use the Servico model to find a specific servico
  Servico.update({ iduser: req.user._id, _id: req.params.servico_id }, { status: req.body.status, thumb: req.body.thumb, foto: req.body.foto }, function (err, servico) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', servico: servico });
  });
};

// Create endpoint /api/servicos/:servico_id for DELETE
exports.deleteServico = function (req, res) {
  // Use the Servico model to find a specific servico and remove it
  Servico.remove({ iduser: req.user._id, _id: req.params.servico_id }, function (err) {
    if (err)
      return res.send(err);

    res.json({ message: 'success' });
  });
};
// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    email: req.body.email,
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    senha: req.body.senha
  });

  user.save(function(err) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', data: user });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      return res.send(err);

    res.json(users);
  });
};
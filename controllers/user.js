// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUser = function (req, res) {
  var user = new User({
    email: req.body.email,
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    senha: req.body.senha
  });

  user.save(function (err) {
    if (err)
      return res.send(err);

    res.json({ message: 'success', data: user });
  });
};

exports.putUser = function (req, res) {

  var emailHeader = req.headers.email;
  var senhaHeader = req.headers.senha;

  User.findOne({ email: emailHeader }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });

    user.verifyPassword(senhaHeader, function (err, isMatch) {
      if (err)
        return res.send(err);
      if (!isMatch)
        return res.json({ message: 'wrongpass' });


      // Existe
      User.findOne({ email: emailHeader }, function (err, user) {
        user.email = req.body.email;
        user.nome = req.body.nome;
        user.sobrenome = req.body.sobrenome;
        user.senha = req.body.senha;
        user.save();

        if (err)
          return res.send(err);

        res.json({ message: 'success', data: user });
      });

    });
  });
};


// Create endpoint /api/users for GET
exports.getUser = function (req, res) {

  var emailHeader = req.headers.email;
  var senhaHeader = req.headers.senha;

  User.findOne({ email: emailHeader }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });

    user.verifyPassword(senhaHeader, function (err, isMatch) {
      if (err)
        return res.send(err);
      if (!isMatch)
        return res.json({ message: 'wrongpass' });

      // Success
      return res.json({ message: 'success', data: user });
    });

  });
};
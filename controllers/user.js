// Load required packages
var User = require('../models/user');
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport('smtps://droidgodev%40gmail.com:090219ZeXoWa@smtp.gmail.com')

//Cria novo usuario e envia token de ativação
exports.postUser = function (req, res) {
  var user = new User({
    email: req.body.email,
    nome: req.body.nome,
    sobrenome: req.body.sobrenome,
    senha: req.body.senha
  });

  require('crypto').randomBytes(32, function (err, buffer) {
    if (err)
      return res.send(err);

    user.token = buffer.toString('hex');

    user.save(function (err) {
      if (err)
        return res.send(err);

      // setup e-mail data with unicode symbols
      var mailOptions = {
        from: "Sagesp Online <noreplay@sagesponline.com.br>", // sender address
        to: user.email, // list of receivers
        subject: "Olá " + user.nome, // Subject line
        html: "<a href='https://www.sagesponline.com.br/api/userAuth/" + user.token + "'>Ativar Conta Sagesp</a>" // html body

      }

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
      });

      res.json({ message: 'success', user: user });
    });
  });
};


//Edita usuario logado
exports.putUser = function (req, res) {

  User.findOne({ _id: req.body._id }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });

    user.email = req.body.email;
    user.nome = req.body.nome;
    user.sobrenome = req.body.sobrenome;
    user.senha = req.body.senha;
    user.save();

    res.json({ message: 'success', user: user });

  });

};


// GET usuario logado
exports.getUser = function (req, res) {

  User.findOne({ email: req.headers.email }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });
    if (!user.ativo)
      return res.json({ message: 'userinativo' })

    return res.json({ message: 'success', user: user });

  });
};

//Ativa usuario
exports.postUserAuth = function (req, res) {

  User.findOne({ token: req.params.token }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'notoken' });

    user.token = null;
    user.ativo = true;
    user.save();

    res.json({ message: 'success', user: user });

  });

};

//chama esqueceu senha
exports.getForgotPass = function (req, res) {
  //procura pelo email passado
  User.findOne({ email: req.headers.email }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'nouser' });
    if (!user.ativo)
      return res.json({ message: 'userinativo' });

    //se achou email e usuario ativo gera senha de 4 chars
    require('crypto').randomBytes(2, function (err, buffer) {
      if (err)
        return res.send(err);

      user.senhaTemp = buffer.toString('hex');

      //gera um token
      require('crypto').randomBytes(32, function (err, buffer) {
        if (err)
          return res.send(err);

        user.token = buffer.toString('hex');

        var mailOptions = {
          from: "Sagesp Online <noreplay@sagesponline.com.br>", // sender address
          to: user.email, // list of receivers
          subject: "Olá " + user.nome, // Subject line
          html: "<b>Sua nova senha temporária: " + user.senhaTemp + "</b><br/><a href='https://www.sagesponline.com.br/api/" + user.token + "'>Click aqui para ativar sua senha temporária</a>" // html body

        }

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log(error);
          }
        });

        user.save();

        res.json({ message: 'success', user: user });

      });
    });
  });
};

//ativa senha esquecida
exports.postForgotPass = function (req, res) {

  User.findOne({ token: req.params.token }, function (err, user) {
    if (err)
      return res.send(err);
    if (!user)
      return res.json({ message: 'notoken' });

    //user.cript(user.senhaTemp, function (err, hash) {
      //if (err) { return callback(err); }
      user.token = null;
      user.senha = user.senhaTemp;
      user.senhaTemp = null;
      user.save();
      
      res.json({ message: 'success', user: user });
    //});
  });
};

//lista de usuarios mesmo nao estando logado
exports.getUsers = function (req, res) {

  /* User.find(function (err, user) {
     if (err)
       return res.send(err);
     if (!user)
       return res.json({ message: 'nouser' });
 
     // Success
     return res.json({ message: 'success', user: user });
 
   });*/
};
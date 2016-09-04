// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var servicoController = require('./controllers/servico');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

// Connect to the sagespdb MongoDB
mongoose.connect('mongodb://localhost:27017/sagespdb');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use the passport package in our application
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "email, Content-Type, Authorization");
  next();
});

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /servicos
router.route('/servicos')
  .post(authController.isAuthenticated, servicoController.postServicos)
  .get(authController.isAuthenticated, servicoController.getServicos);

// Create endpoint handlers for /servicos/:servico_id
router.route('/servicos/:servico_id')
  .get(authController.isAuthenticated, servicoController.getServico)
  .put(authController.isAuthenticated, servicoController.putServico)
  .delete(authController.isAuthenticated, servicoController.deleteServico);

// Create endpoint handlers for /user
router.route('/user')
  .post(userController.postUser)
  .put(authController.isAuthenticated, userController.putUser)
  .get(authController.isAuthenticated, userController.getUser);

// Ativar user
router.route('/userAuth/:token')
  .get(userController.getUserAuth);

// Esqueceu a senha
router.route('/forgotPass')
  .get(userController.getForgotPass);

// Esqueceu a senha
router.route('/forgotPassAct/:token')
  .get(userController.getForgotPassAct);

router.route('/usersList')
  .get(userController.getUsers);

// Register all our routes with /api
app.use('/api', router);

// Start the server

app.listen(8080, function(){
  console.log("Node server listening on port 3000" )
});
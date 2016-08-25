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

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Register all our routes with /api
app.use('/api', router);

// Start the server

app.listen(3000, function(){
  console.log("Node server listening on port 3000" )
});
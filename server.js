// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth'


mongoose.connect('mongodb://localhost:27017/sagesp');


// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(passport.initialize());


// Use environment defined port or 3000
var port = 8080;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'You are running dangerously low!' });
});

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);




// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert REST on port ' + port);

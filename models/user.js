// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new mongoose.Schema({
  email: String,
  nome: String,
  sobrenome: String,
  senha: String
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the senha hasn't changed
  if (!user.isModified('senha')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.senha, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.senha = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(senha, cb) {
  bcrypt.compare(senha, this.senha, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
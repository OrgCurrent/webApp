'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info; 
    // returns an error message that is displayed on the login screen, if the user does not exist
    if (error) return res.json(401, error);
    req.logIn(user, function(err) {
      if (err) return res.send(err);
      // update the last login date in the user object
      User.findOne({_id : user._id})
        .exec(function(err, user){
          user.lastLogin = Date.now();
          user.save(function(err, saveUser){
            if (err) return res.send(err);
          });
        });
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};
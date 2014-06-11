'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Score = mongoose.model('Score'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * Get a user and populate the scores
 */
exports.getScores = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId)
      .exec(function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);

        res.send(user);
      });
};
/**
 * Post a score to a user
 * Post params: @x, @y
 * TODO: Check to make sure post hasn't been made within last 24 hours
 */
exports.postScore = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId)
      .exec(function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);
        user.scores.create({
          x: req.body.x,
          y: req.body.y
        });
        user.save(function (err) {
          if (err) return next(err);
          res.send(user);
        });
      });
};
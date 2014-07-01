'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    passport = require('passport'),
    APIconfig = require('../../config/config'),
    domainHelper = require('./domainHelper.js'),
    Mailgun = require('mailgun-js');


var sendVerification = function(newUser) {  
    var debugmode = APIconfig.Mailgun.debugmode;

    var mailgun = new Mailgun({
      apiKey: APIconfig.Mailgun.API_KEY,
      domain: APIconfig.Mailgun.SANDBOX
    });

    if (debugmode) {
      var data = {
        from: 'Happy Meter Registry <register@happymeter.com>',
        to: APIconfig.Mailgun.debugEmails,
        subject: 'Thank you for signing up for Cat Facts: Your daily source for facts about cats.',
        text: 'Please Verify Your Email: \n http://localhost:9000/api/users/' + id + '/verify/' + hash
      };
    } else {
      var data = {
        from: 'Happy Meter Registry <register@happymeter.com>',
        to: newUser.email,
        subject: 'Please register for HappyMeter',
        text: 'Please Verify Your Email: \n http://localhost:9000/api/users/' 
              + newUser._id + '/verify/' + newUser.verificationHash
      };
    }

    mailgun.messages().send(data, function (error, body) {
      if (error) {console.log(error)}
    });
}

var createUser = function(req, res) {
  var randnum = Math.floor(Math.random()*1000000000);
  var verificationHash = randnum.toString(16);
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.verificationHash = verificationHash;
  newUser.save(function(err, user) {
          if (err) return res.json(400, err);
          sendVerification(newUser);
          //TODO: Handle errors
          return res.json(201);
        });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  //parse the email for the domain name
  var companyId;
  var domainName = req.body.email.replace(/.*@/, "");
  if (!domainHelper.isValid(domainName)) {
    res.send(400, {errorType: "Domain Name Blacklist", domain: domainName})
  } else {  
    var newCompany = new Company({domainName : domainName});

    Company.findOne({domainName : domainName})
    .exec(function(err, company){
      if(!company){
        newCompany.save(function(err, company){

          req.body.company = company._id;
          createUser(req, res);

        });
      } else {
        req.body.company = company._id;
        createUser(req, res);
      }
    });
  }
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send(user.profile);
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
        res.send(user.score);
      });
};

/**
 * Post a score to a user
 * Post params: @x, @y
 */
exports.postScore = function (req, res, next) {
  var userId = req.params.id;
  User.findById(userId)
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return res.send(404);

      var currentDate = Date.now();

      user.lastPost = user.lastPost || 0;

      // check if user has posted in the last 24 hours 1000 * 60 * 60 *24
      // or if the user has not posted previously
      if(currentDate - user.lastPost < 86400000){
        res.send(429);
      } else {
        // was last post within the past week? points count doubly
        var doublePoints = Date.now() - user.lastPost <= (1000 * 60 * 60 * 24 * 7);
        // if yes, give user 10 points, otherwise give 5
        var pointValue = doublePoints ? 10 : 5;
        user.rewardPoints += pointValue; 
        user.lastPost = currentDate;
        // unshift ensures that the latest posts are appended to the beginning of the array
        user.scores.unshift({
          x: req.body.x,
          y: req.body.y
        });

        user.save(function (err) {
          if (err) return next(err);
          var result = user.userInfo;
          result.earnedPoints = pointValue;
          res.send(201, result);
        });
      }
  });
};

/**
 * Post a score to a user
 */
exports.verifyEmail = function (req, res, next) {
  var userId = req.params.id;

  User.findOne({_id: userId})
      .exec(function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(404);
        if (user.verified) { 
          res.redirect("/login?action=verified");
        } else if(user.verificationHash === req.params.hash) {  
          user.verified = true;
          user.save(function (err) {
            res.redirect("/login?action=verified");
          });
        } else {
          res.send(404, {error: "Invalid hash"});
        }
      });
};

'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    passport = require('passport');

var createUser = function(req, res) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  newUser.save(function(err, user) {
          if (err) return res.json(400, err);
          req.logIn(newUser, function(err) {
            if (err) return next(err);

            return res.json(req.user.userInfo);
          });
        });
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  //parse the email for the domain name
  var companyId;
  var domainName = req.body.email.replace(/.*@/, "");
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
  })

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

      var currentDate = new Date();
      
      var stringCurrentDate =  "" + currentDate.getDate() + currentDate.getMonth() 
      + currentDate.getFullYear();

      var lastPostStringDate;

      var saveScore = false;


      // if the user has a posted previously
      if(user.lastPost){
        lastPostStringDate = "" + user.lastPost.getDate() + user.lastPost.getMonth() 
        + user.lastPost.getFullYear();

        // check if user has posted in the last 24 hours
        if(lastPostStringDate === stringCurrentDate){
          console.log('repeat post on day detected');
          res.send({ userInfo: user.userInfo });
        } else {
          saveScore = true;
        }
      // if the user has not posted previously
      } else {
        saveScore = true;
      }
    
       // saves the post in the db
      if(saveScore) {
        user.lastPost = currentDate;
        // unshift ensures that the latest posts are appended to the beginning of the array
        user.scores.unshift({
          x: req.body.x,
          y: req.body.y
        });

        user.save(function (err) {
          if (err) return next(err);
          res.send({ userInfo: user.userInfo });
        });
      }
  });
};
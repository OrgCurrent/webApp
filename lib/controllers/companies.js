'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User');


/**
 * This function gets user objects from the company, and outputs scores 
 in a format convenient for the client, while removing unnecessary parameters
 Outputs an array of user objects
 */
var getScoresFromCompanyUsers = function(companyUsers, res) {
  var outputUsers = [];
  for(var user = 0; user < companyUsers.length; user++){
    if(companyUsers[user].scores.length) {
      outputUsers.push(companyUsers[user].score);
    }
  }
  res.send(outputUsers);
};

var getMostRecentScoreFromCompanyUsers = function(companyUsers, res) {
  var outputUsers = [];
  for(var user = 0; user < companyUsers.length; user++){
    if(companyUsers[user].scores.length) {
      var outputUser = {
        'score' : companyUsers[user].scores[0]
      };
      outputUsers.push(outputUser);
    }
  }
  res.send(outputUsers);
};
/**
 * Get current user
 * Post body parameters: @domainName
 */
exports.create = function (req, res, next) {
  var newCompany = new Company(req.body);
  newCompany.save(function(err) {
    if (err) return res.json(400, err);
    res.json(201, newCompany);
  });
};

/**
 * Get a company
 */
exports.show = function (req, res, next) {
  var companyId = req.params.id;

  Company.findById(companyId, function (err, company) {
    if (err) return next(err);
    if (!company) return res.send(404);

    res.send(company);
  });
};

/**
 * Get scores for current company
 * TODO: Format so that it matches results in spec
 */
exports.getScores = function (req, res, next) {
  var companyId = req.params.id;
  User.find({company: companyId})
      .populate('scores')
      .exec(function (err, usersFromCompany) {
        if (err) return next(err);
        getScoresFromCompanyUsers(usersFromCompany, res);
      });
};

/**
 * Get most recent scores for each user for current company
 */
exports.getMostRecentScores = function (req, res, next) {
  var companyId = req.params.id;
  User.find({company: companyId})
      .populate('scores')
      .exec(function (err, usersFromCompany) {
        if (err) return next(err);
        getMostRecentScoreFromCompanyUsers(usersFromCompany, res);
      });
};

/**
 * Get most recent scores for each user for current company
 */
exports.createMilestone = function (req, res, next) {
  var companyId = req.params.id;
  Company.findOne({_id: companyId}, function (err, company) {
    if (err) return next(err);

    company.milestones.unshift({
      milestoneDate: req.body.milestoneDate,
      milestoneCategory: req.body.milestoneCategory,
      addUser: req.body.curentUser 
    });

    company.save(function (err) {
      if (err) return next(err);
      return res.send(company);
    });
  });
};

exports.getMilestones = function (req, res, next) {
  var companyId = req.params.id;
  Company.findOne({_id: companyId}, function (err, company) {
    if (err) return next(err);
    res.send(company);
  });
};

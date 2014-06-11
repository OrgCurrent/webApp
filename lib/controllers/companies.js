'use strict';

var mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User'),
    Score = mongoose.model('Score');

/**
 * Get current user
 * Post body parameters: @domainName
 */
exports.create = function (req, res, next) {
  var newCompany = new Company(req.body);
  newCompany.save(function(err) {
    if (err) return res.json(400, err);
    res.json(newCompany);
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
 * Get current user
 * TODO: Format so that it matches results in spec
 */
exports.getScores = function (req, res, next) {
  var companyId = req.params.id;

  Users.findAll({company: companyId})
       .populate('scores')
       .exec(function (err, users) {
          if (err) return next(err);
          res.send(company);
        });
};

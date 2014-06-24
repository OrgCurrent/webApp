'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Company = mongoose.model('Company');
var Invite = mongoose.model('Invite');
var userArray = [];

/**
 * Populate database with sample application data
 */

// Clear old users, then add a number of users
var testCompany = new Company({
  domainName: 'test.com'
});

Company.find({}).remove(function() {
  testCompany.save(function (err) {
    if (err) {console.log(err);}
  });
});

var userMaker = function(number) {
  for (var i = 0; i < number; i++) {
    userArray.push(
      new User({
        provider: 'local',
        name: 'Test Employee ' + i,
        email: 'employee'+i+'@test.com',
        password: 'test',
        role: 'employee',
        verified: true,
        company: testCompany._id
      })
    ); 
  }
  userArray.forEach(function(user) {
    for (var i = 1; i < 13; i++) {
      var voteDate = Date.now() - i * 86400000;
      //since we're adding these in reverse-chron order, first one should be latest
      if(i === 1) {user.lastPost = voteDate;}
      user.scores.push({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        date: voteDate
      });
    }
    user.save(function(err) {
      if(err) {console.log(err);}
    });
  });
};

User.find({}).remove(function() {
  userMaker(5);
  var exec = User.create({
    provider: 'local',
    company: testCompany._id,
    name: 'Test Executive',
    email: 'executive@test.com',
    password: 'test',
    role: 'executive',
    verified: true 
  });
});

Invite.remove({});

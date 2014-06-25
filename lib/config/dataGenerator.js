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
    //smoother data
    user.lastPost = Date.now() - 86400000;

    user.scores.push({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      date: Date.now() - 86400000
    });

    for (var i = 2; i < 1000; i++) {
      //smoother data
      if(Math.random() < 0.333){
        var x1 = user.scores[user.scores.length - 1].x + Math.floor(Math.random() * 20) - 9.5;
        var y1 = user.scores[user.scores.length - 1].y + Math.floor(Math.random() * 20) - 9.5;
        x1 = Math.max(0, Math.min(x1, 100));
        y1 = Math.max(0, Math.min(y1, 100));

        user.scores.push({
          x: x1,
          y: y1,
          date: Date.now() - i * 86400000
        });
      }
    }
    user.save(function(err) {
      if(err) {console.log(err);}
    });
  });
};

User.find({}).remove(function() {
  userMaker(50);
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
var exec = User.create({
    provider: 'local',
    company: testCompany._id,
    name: 'Test Executive',
    email: 'executive@test.com',
    password: 'test',
    role: 'executive',
    verified: true 
});

Invite.remove({});

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

var assignSeed = function() {
  var seed1 = [8, 7, 8, 7, 7, 8, 7, 8, 7, 7, 8, 8, 7, 7, 7, 7, 7, 8, 7, 7, 7, 8, 7, 7, 7, 8, 8, 7, 8, 8, 7, 7, 7, 7, 8, 8, 8, 9, 8, 8, 9, 9, 9, 8, 8, 9, 9, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 9, 10, 9, 9, 9, 9, 10, 10, 6, 7, 7, 6, 6, 6, 6, 6, 7, 7, 6, 7, 7, 7, 6, 7, 6, 7, 6, 6, 7, 6, 6, 6, 6, 7, 6, 6, 7, 6]
  var seed2 = [7, 6, 7, 6, 6, 7, 6, 9, 8, 8, 9, 9, 8, 8, 6, 8, 6, 9, 6, 8, 6, 7, 6, 8, 6, 9, 7, 6, 7, 9, 6, 8, 8, 6, 7, 9, 9, 10, 9, 7, 10, 8, 10, 9, 7, 10, 10, 9, 9, 9, 8, 10, 10, 8, 8, 8, 9, 10, 9, 8, 8, 10, 8, 8, 9, 5, 8, 6, 7, 5, 5, 7, 5, 8, 8, 5, 6, 8, 6, 7, 6, 5, 8, 5, 7, 8, 7, 5, 5, 7, 8, 5, 5, 8, 5]
  var seed3 = [5, 5, 5, 4, 5, 6, 4, 5, 5, 4, 6, 6, 5, 5, 5, 4, 5, 5, 5, 5, 6, 7, 7, 6, 6, 8, 8, 7, 8, 7, 6, 6, 6, 6, 8, 7, 8, 8, 8, 8, 9, 9, 9, 8, 8, 9, 8, 8, 7, 7, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 8, 9, 9, 8, 7, 7, 7, 7, 9, 9, 7, 8, 9, 8, 7, 8, 7, 8, 8, 8, 8, 8, 7, 8, 7, 8, 8, 7, 9, 7];
  var rand = Math.random();
  if (rand < 0.333) {
    return seed1;
  } else if (rand > 0.666) {
    return seed2;
  } else {
    return seed3;
  }
}

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

    var userSeed = assignSeed();

    for (var i = 0; i < userSeed.length; i++) {
      //smoother data
        var delta = Math.round(Math.random() * 2);
        var deltaFinal = Math.random() > 0.5 ? userSeed[i] + delta : userSeed[i] - delta;
        var x1 = userSeed[i];
        var y1 = deltaFinal >= 10 ? 10 : deltaFinal;
        console.log(y1);
        var date = Date.now() - 86400000 * i; 

        user.scores.push({
          x: x1,
          y: y1,
          date: date
        });
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

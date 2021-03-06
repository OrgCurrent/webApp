'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user;
var bob;
var cachedUserId;
var cachedCompanyId;

describe('User Model', function() {
  before(function(done) {
    user = new User({
      provider: 'local',
      name: 'test',
      email: 'test@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

    // Clear users before testing
    User.remove().exec();
    done();
  });

  after(function(done) {
    User.remove().exec();
    done();
  });

  it('should begin with no users', function(done) {
    User.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    user.save();
    var userDup = new User(user);
    userDup.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when saving without an email', function(done) {
    user.email = '';
    user.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    user.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    user.authenticate('blah').should.not.be.true;
  });

});

/**
 *  Testing the users create user endpoint
 */

describe('User Routes', function() {

  before(function(done) {
    user = new User({
      provider: 'local',
      name: 'test',
      email: 'test@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

    bob = new User({
      provider: 'local',
      name: 'bob',
      email: 'bob@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

    // Clear users before testing
    User.remove().exec();
    done();
  });

  describe('POST /api/users', function(){

    it('should correctly create a new user, and a new company if required', function(done) {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(201)  
        .end(function(err, res) {
          if (err) return done(err);
          res.body.name.should.equal('test');
          res.body.role.should.equal('employee');
          res.body.provider.should.equal('local');
          cachedUserId = res.body.id;
          cachedCompanyId = res.body.company;
          done();
        });

    /*
    TODO - add get request to fetch the user to the make sure the user is actually created
    */
    });

    it('should create a new user at an existing company', function(done) {
      request(app)
        .post('/api/users')
        .send(bob)
        .expect(201)  
        .end(function(err, res) {
          if (err) return done(err);
          // TODO - test for the company name in the response, change from profile info?
          res.body.name.should.equal('bob');
          res.body.role.should.equal('employee');
          res.body.provider.should.equal('local');
          res.body.company.should.equal(cachedCompanyId);
          done();
        });

    /*
    TODO - add get request to fetch the user to the make sure the user is actually created
    */
    });
    /*
      TODO - add POST request to check if a company has been created, when a new user is created
      when that company is new
    */

  });

  /*
  TODO - create test for changing password
  */  

  /*
  TODO - create test for login with an incorrect password
  */

  /*
  TODO - create test for testing the /api/users/me endpoint GET (users.me)
  */

  describe('GET /api/users/:id', function() {
    
    it('should return a users profile details (name, role, verified status, lastLogin, company', function(done) {
      request(app)
        .get('/api/users/' + cachedUserId)
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          var profile = res.body;
          profile.name.should.equal('test');
          profile.role.should.equal('employee');
          profile.verified.should.be.false;
          done();
        });
    });
  }); 

  describe('POST /api/users/:id/score', function() {
    
    it('should register a new score posted by a user', function(done) {
      request(app)
        .post('/api/users/' + cachedUserId + '/scores')
        .send({
          x: 10,
          y: 20
        })
        .expect(201)  
        .end(function(err, res) {
          if (err) return done(err);
          var scoreItem = res.body.scores[0];
          var timeDiff = Date.now() - Date.parse(scoreItem.date);
          var timeDiffBool = timeDiff < 5000;
          //should return the posted score, and the timestamp of the posted score should be
          //accurate to 5 seconds (5000ms)
          scoreItem.x.should.equal(10);
          scoreItem.y.should.equal(20);
          timeDiffBool.should.equal(true);
          done();
        });
    });

    it('should limit each user to one post every 24 hours', function(done) {
      request(app)
        .post('/api/users/' + cachedUserId + '/scores')
        .send({
          x: 30,
          y: 40
        })
        .expect(429)  
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  /*
  TODO - Add test to ensure it is possible for user to post 24 hours after their initial post
  */

  /*
  TODO - create test for testing the /api/users/:id/score endpoint GET (users.getScore)
  */

  describe('GET /api/users/:id/scores', function() {
    
    it('should get all scores for a particular user', function(done) {
      request(app)
        .get('/api/users/' + cachedUserId + '/scores')
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          res.body.scores[0].x.should.equal(10);
          res.body.scores[0].y.should.equal(20);
          done();
        });
    });
  });

});

'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var user;

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

  afterEach(function(done) {
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

describe('POST /api/users', function() {

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
  
  it('should return the username, role and provider when creating a user', function(done) {
    request(app)
      .post('/api/users')
      .send(user)
      .expect(200)  
      .end(function(err, res) {
        if (err) return done(err);
        res.body.name.should.equal('test');
        res.body.role.should.equal('user');
        res.body.provider.should.equal('local');
        done();
      });
  });
});

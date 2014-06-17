'use strict';

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    User = mongoose.model('User');;

var company;
var cachedCompanyId;
var cachedUserId;

var user = new User({
      provider: 'local',
      name: 'comptest',
      email: 'comptest@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

var user2 = new User({
      provider: 'local',
      name: 'comptest2',
      email: 'comptest2@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

var userCreate = function(userObj, x, y, done) {
  request(app)
        .post('/api/users')
        .send(userObj)
        .expect(201)  
        .end(function(err, res) {
          if (err) return done(err);
          cachedUserId = res.body.id;
          cachedCompanyId = res.body.company;
          // done();
          postScore(x, y, done)
        });
};

var postScore = function(x, y, done) {
   request(app)
      .post('/api/users/' + cachedUserId + '/scores')
      .send({
        x: x,
        y: y
      })
      .expect(201)  
      .end(function(err, res) {
        if (err) return console.log(err);

        if(done){
          done();
        }
      });
};

describe('Company Model', function() {
  before(function(done) {

    company = new Company({
      domainName : 'test.com'
    });

    // Clear companies before testing
    Company.remove().exec();
    done();
  });

  afterEach(function(done) {
    Company.remove().exec();
    done();
  });

  it('should begin with no companies', function(done) {
    Company.find({}, function(err, companies) {
      companies.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate company', function(done) {
    company.save();
    var companyDup = new Company(company);
    companyDup.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it('should fail when saving without a domain name', function(done) {
    company.domainName = '';
    company.save(function(err) {
      should.exist(err);
      if(done){
        done();
      }
    });
  });

});

/**
 *  Testing the users create user endpoint
 */

describe('Company Routes', function() {

  before(function(done) {

    userCreate(user, 15, 25);
    setTimeout(function(){
      userCreate(user2, 20, 50, done);
    }, 10);

    // // Clear users before testing
    // User.remove().exec();
    after(function(done) {
      User.remove().exec();
      done();
    });
  });

  xdescribe('POST /api/companies', function(){

    it('should correctly create a new company', function(done) {
      request(app)
        .post('/api/companies')
        .send(user)
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  /*
  TODO - get companies
  */
  xdescribe('GET /api/companies', function() {
   
    it('should return a list of all the companies', function(done) {
      request(app)
        .get('/api/companies')
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });

    });

  });

  describe('GET /api/companies/:id', function() {
   
    it('should return details about a specific company', function(done) {
      request(app)
        .get('/api/companies/' + cachedCompanyId)
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          res.body.domainName.should.be.exactly('testing.com');
          done();
        });

    });

  });

  describe('GET /api/companies/:id/scores', function() {

    it('should return all the scores for a company', function(done) {
      request(app)
        .get('/api/companies/' + cachedCompanyId + '/scores')
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          res.body[0].scores[0].x.should.be.exactly(15);
          res.body[1].scores[0].y.should.be.exactly(50);
          done();
        });

    });

    it('should return all the recent scores for a company', function(done) {
      request(app)
        .get('/api/companies/' + cachedCompanyId + '/scores/mostrecent')
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);  
          res.body[0].score.x.should.be.exactly(15);
          res.body[1].score.y.should.be.exactly(50);
          done();
        });

    });

  });

});

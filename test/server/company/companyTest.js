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
      done();
    });
  });

});

/**
 *  Testing the users create user endpoint
 */

describe('Company Routes', function() {

  before(function(done) {
    var user = new User({
      provider: 'local',
      name: 'comptest',
      email: 'comptest@testing.com',
      password: 'password',
      domainName: 'testing.com'
    });

    request(app)
        .post('/api/users')
        .send(user)
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          cachedUserId = res.body.id;
          cachedCompanyId = res.body.company;
          // done();
          request(app)
            .post('/api/users/' + cachedUserId + '/scores')
            .send({
              x: 10,
              y: 20
            })
            .expect(200)  
            .end(function(err, res) {
              if (err) return console.log(err);
              done();
            });
        });

    

    // // Clear users before testing
    // User.remove().exec();
    
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

  xdescribe('GET /api/companies/:id', function() {
   
    it('should return details about a specifc company', function(done) {
      request(app)
        .get('/api/companies/' + cachedCompanyId)
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });

    });

  });

  describe('GET /api/companies/:id/scores', function() {

    it('should return all the recent scores for a company', function(done) {
      request(app)
        .get('/api/companies/' + cachedCompanyId + '/scores')
        .expect(200)  
        .end(function(err, res) {
          if (err) return done(err);
          console.log(res.body[0][0])
          res.body[0][0].x.should.be.exactly(10);
          res.body[0][0].y.should.be.exactly(20);
          done();
        });

    });

    //first create users with scores
    //then create users which are assigned to a company
    //then get scores for that company

     /*
  TODO - get companies GET all recent scores for a company
  */

  });

});

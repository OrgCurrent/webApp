'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    companies = require('./controllers/companies'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);
  app.route('/api/users/:id/scores')
    .post(users.postScore)
    .get(users.getScores);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/api/companies/')
    .post(companies.create);
  app.route('/api/companies/:id')
    .get(companies.show);
  app.route('/api/companies/:id/scores')
    .get(companies.getScores);
  app.route('/api/companies/:id/scores/mostrecent')
    .get(companies.getMostRecentScores);


  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};
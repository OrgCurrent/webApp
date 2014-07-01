'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    companies = require('./controllers/companies'),
    session = require('./controllers/session'),
    invite = require('./controllers/invite'),
    middleware = require('./middleware')

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes

  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(middleware.auth, users.me);
  app.route('/api/users/:id')
    .get(middleware.auth, users.show);
  app.route('/api/users/:id/scores')
    .post(middleware.auth, users.postScore)
    .get(middleware.auth, users.getScores);
  app.route('/api/users/:id/verify/:hash')
    .get(users.verifyEmail);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/api/companies/')
    .post(companies.create);
  app.route('/api/companies/:id')
    .get(middleware.auth, companies.show);
  app.route('/api/companies/:id/scores')
    .get(middleware.auth, companies.getScores);
  app.route('/api/companies/:id/scores/mostrecent')
    .get(middleware.auth, companies.getMostRecentScores);
  app.route('/api/companies/:id/milestones')
    .post(middleware.auth, companies.createMilestone)
    .get(middleware.auth, companies.getMilestones);

  app.route('/invite/:email')
    .put(middleware.auth, invite.sendInvite);

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
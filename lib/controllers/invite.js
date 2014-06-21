'use strict';

var mongoose = require('mongoose'),
    APIconfig = require('../../config/config'),
    Mailgun = require('mailgun-js'),
    User = mongoose.model('User'),
    Invite = mongoose.model('Invite');

exports.sendInvite = function (req, res) {
  var inviteeEmail = req.params.email;
  var data = {
    from: 'Happy Meter Registry <register@happymeter.com>',
    to: inviteeEmail,
    subject: 'Please register for HappyMeter',
    text: 'Please Verify Your Email'
  };
  var mailgun = new Mailgun({
    apiKey: APIconfig.Mailgun.API_KEY,
    domain: APIconfig.Mailgun.SANDBOX
  });

  Invite.findOne({email: inviteeEmail}, function (err, invite) {
    if(err) {return res.send(404, err);}
    if(invite) {return res.send(200);}      
    User.findOne({
      email: inviteeEmail
    }, function (err, user) {
      if(err) {return res.send(404, err);}
      if(user) {return res.send(200);}
      Invite.create({email: inviteeEmail}, function (err) {
        if(err) {return res.send(404, err);}
        mailgun.messages().send(data, function (err, body) {
          if (err) {return res.send(404, err);}
          return res.send(200);
        });  
      });
    });
  });
};

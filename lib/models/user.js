'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
  
var authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * Score Schema - a subdoc / child Schema of User Schema
 */

var ScoreSchema = new Schema({
  date: { type: Date, default: Date.now },
  x: Number,
  y: Number
});

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  role: { type: String, default: 'employee' },
  hashedPassword: String,
  salt: String,
  verified: { type: Boolean, default: false },
  verificationHash: String,
  lastLogin: Date,
  lastPost: Date,
  scores: [ScoreSchema],
  rewardPoints: {type: Number, default: 0}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Basic info to identify the current authenticated user in the app
UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'id': this._id,
      'provider': this.provider,
      'company': this.company,
      'scores': this.scores,
      'lastPost': this.lastPost,
      'verified': this.verified,
      'rewardPoints': this.rewardPoints
    };
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'verified': this.verified,
      'lastLogin': this.lastLogin,
      'company': this.company,
      'rewardPoints': this.rewardPoints
    };
  });

UserSchema
  .virtual('score')
  .get(function() {
    return {
      'id': this._id,
      'scores': this.scores
    };
});
/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('User', UserSchema);

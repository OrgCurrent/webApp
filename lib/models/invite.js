'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var InviteSchema = new Schema({
  email: { type: String, unique: true }
});

// Validate empty domainname

mongoose.model('Invite', InviteSchema);

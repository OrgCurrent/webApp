'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var CompanySchema = new Schema({
  domainName: { type: String, unique: true }
});

// Validate empty domainname
CompanySchema
  .path('domainName')
  .validate(function(domainName) {
    // if you are authenticating by any of the oauth strategies, don't validate
    return domainName.length
  }, 'domain Name cannot be blank');

mongoose.model('Company', CompanySchema);

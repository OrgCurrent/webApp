'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var MilestoneSchema = new Schema({
  milestoneDate: Date,
  milestoneCategory: String,
  addUser: String 
});

var CompanySchema = new Schema({
  domainName: { type: String, unique: true },
  milestones: [MilestoneSchema]
});

// Validate empty domainname
CompanySchema
  .path('domainName')
  .validate(function(domainName) {
    return domainName.length;
  }, 'domain Name cannot be blank');

mongoose.model('Company', CompanySchema);

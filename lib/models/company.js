'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var CompanySchema = new Schema({
  domainName: { type: String, unique: true }
});

mongoose.model('Company', CompanySchema);

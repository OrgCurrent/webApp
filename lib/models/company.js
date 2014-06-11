'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var CompanySchema = new Schema({
  domainName: String
});

mongoose.model('Company', CompanySchema);

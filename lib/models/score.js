'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ScoreSchema = new Schema({
  date: { type: Date, default: Date.now },
  x: Number,
  y: Number
});

mongoose.model('Score', ScoreSchema);

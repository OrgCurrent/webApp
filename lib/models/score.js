'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ScoreSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  x: Number,
  y: Number
});

mongoose.model('Score', ScoreSchema);

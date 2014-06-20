'use strict';

angular.module('storedUserData', [])
  .service('storedUserData', function() {
    var userData = {
        scoredToday : false
    };
    this.setScored = function(input) {
      console.log(input);
      userData.scoredToday = input;
    };
    this.getScored = function() {
      return userData.scoredToday;
    };

});

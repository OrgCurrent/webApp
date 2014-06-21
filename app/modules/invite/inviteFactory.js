'use strict';

angular.module('happyMeterApp')
  .factory('InviteFactory', function ($http) {
    var InviteFactory = {};
    InviteFactory.sendInvite = function(email) {
      return $http.put('http://localhost:9000/invite/' + email).$promise;
    }
    return InviteFactory;
  });
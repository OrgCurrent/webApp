'use strict';

angular.module('happyMeterApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });

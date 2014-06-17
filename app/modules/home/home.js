'use strict';

angular.module('happyMeterApp')
  .controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log($scope.currentUser);
  }]);

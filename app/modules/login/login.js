'use strict';

angular.module('happyMeterApp')
  .controller('LoginCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.user = {
      email: 'slave@company.com',
      password: 'test'
    };
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  }]);
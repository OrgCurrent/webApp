'use strict';

angular.module('happyMeterApp')
  .controller('LoginCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.errors = {};
    $scope.verifiedSuccess = $location.search().action === "verified";
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
'use strict';

angular.module('happyMeterApp')
  .controller('SignupCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
    $scope.user = {};
    $scope.errors = {};

    //default account type: employee
    $scope.user.role = 'employee';

    $scope.register = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          role: $scope.user.role
        })
        .then( function() {
          $location.path('/verification');
        })
        .catch( function(err) {
          if(err.data.errorType === "Domain Name Blacklist") {
            $scope.domainError = {domain: err.data.domain};
          }
          err = err.data;
          $scope.errors = {};


          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
  }]);
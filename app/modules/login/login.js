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
        .then(function(user) {
          var isExecutive = function(){return user.role === 'executive'};
          var userPath = isExecutive() ? '/dashboard' : '/rating';
          $location.path(userPath);
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  }]);
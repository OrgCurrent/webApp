'use strict';

angular.module('happyMeterApp')
  .controller('NavbarCtrl', ['$scope', '$location', 'Auth',
   function ($scope, $location, Auth) {
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

  }]);


'use strict';

angular.module('happyMeterApp')
  .controller('InviteCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.inviteEmail = '';
    $scope.inviteSuccess = false;
    $scope.sendInvite = function(email) {
      $http.put('/invite/' + email)  
      .success(function(){
        $scope.inviteSuccess = true;
        $scope.inviteEmail = '';
      });
    }
  }
]);
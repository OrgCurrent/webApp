'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$scope', '$http', 'scoresGraph', function ($scope, $http, scoresGraph) {
    console.log($scope.currentUser);

    $scope.userData = [];

    $scope.scored = (new Date() - new Date($scope.currentUser.lastPost)) < (86400 * 1000);
    //replace with time check
    console.log($scope.scored);

    if($scope.scored){
      $scope.allowedToVote = true;
    }

    scoresGraph.initialize($scope);
  }]);

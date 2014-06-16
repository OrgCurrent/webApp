'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$scope', '$http', 'scoresGraph', function ($scope, $http, scoresGraph) {
    console.log($scope.currentUser);

    $scope.userData = [];

    var voted = true;
    //replace with time check
    if(voted){
      $scope.allowedToVote = true;
    }

    scoresGraph.initialize($scope);
  }]);

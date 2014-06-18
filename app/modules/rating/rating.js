'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$window','$scope', '$http', 'scoresGraph', function ($window ,$scope, $http, scoresGraph) {
    console.log($scope.currentUser);

    $scope.userData = [];
    $scope.allowedToVote = true;

    $scope.scored = (new Date() - new Date($scope.currentUser.lastPost)) < (86400 * 1000);

    if($scope.scored){
      $scope.allowedToVote = false;
    }

    scoresGraph.initialize($scope);

    d3.select($window).on('resize', function(){
      d3.select("svg").remove();
      scoresGraph.initialize($scope);
    });
  }]);

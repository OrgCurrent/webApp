'use strict';

angular.module('app.rating', ['ratingGraphics', 'storedUserData'])
  .controller('RatingCtrl', ['$window','$scope', '$http', 'scoresGraph','storedUserData', function ($window ,$scope, $http, scoresGraph, storedUserData) {

    $scope.userData = [];

    $scope.scored = (new Date() - new Date($scope.currentUser.lastPost)) < (86400 * 1000);

    if($scope.scored){
      storedUserData.setScored(true);
    }

    scoresGraph.initialize($scope);

    d3.select($window).on('resize', function(){
      d3.select("svg").remove();
      scoresGraph.initialize($scope);
    });
  }]);

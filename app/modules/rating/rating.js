'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$window','$rootScope','$scope', '$http', 'scoresGraph',
   function ($window, $rootScope, $scope, $http, scoresGraph) {

    $scope.userData = [];

    $scope.scored = (new Date() - new Date($scope.currentUser.lastPost)) < (86400 * 1000);

    if($scope.scored){
      $rootScope.currentUser.scoredToday = true;
    }

    scoresGraph.initialize($rootScope, $scope);

    d3.select($window).on('resize', function(){
      // remove all d3 elements prior to redrawing them on the screen after a resize
      d3.select(".ratingsvg").remove();
      d3.selectAll(".tooltip").remove();
      scoresGraph.initialize($rootScope, $scope);
    });
  }]);

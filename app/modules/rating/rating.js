'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$scope', '$http', 'scoresGraph', function ($scope, $http, scoresGraph) {
    console.log($scope.currentUser);
    console.log('here in rating');

    var data = [
      {x: 50, y: 70},
      {x: 30, y: 55},
      {x: 80, y: 10}
    ];

    $scope.userData = [];

    var voted = true;
    //replace with time check
    if(voted){
      $scope.allowedToVote = true;
    }

    scoresGraph.initialize(data, $scope);

  }]);

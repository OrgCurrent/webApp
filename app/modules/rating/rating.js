'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$scope', '$http', 'scoresGraph', function ($scope, $http, scoresGraph) {
    console.log($scope.currentUser);
    console.log('here in rating');

    var data = [
      {a: 50, b: 70},
      {a: 30, b: 55},
      {a: 80, b: 10}
    ];

    $scope.userData = [];

    var voted = true;
    if(voted){
      $scope.allowedToVote = true;
    }

    scoresGraph.initialize(data, $scope);

  }]);

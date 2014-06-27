'use strict';

angular.module('app.rating', ['ratingGraphics'])
  .controller('RatingCtrl', ['$window','$rootScope','$scope', '$http', 'scoresGraph',
   function ($window, $rootScope, $scope, $http, scoresGraph) {

    //scope parameters
    $scope.sizing = {};
    $scope.resize = function(){
      $scope.sizing.margin = {top: 40, right: 40, bottom: 30, left: 30};
      $scope.sizing.width = $('.board-wrapper').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 160) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
      //calculate left position of graph key
      $scope.sizing.keyLeft = Math.max(0,($scope.sizing.width-$scope.sizing.height)/2) + $scope.sizing.margin.left;
    };



    $scope.clickPosition = [];

    $scope.scored = (new Date() - new Date($scope.currentUser.lastPost)) < (86400 * 1000);

    if(!$rootScope.currentUser.scoredToday) {
      $rootScope.currentUser.scoredToday = $scope.scored ? true : false;
    } else {
      $scope.scored = true;
    }


    $scope.resize();
    scoresGraph.initialize($rootScope, $scope, $scope.sizing);

    d3.select($window).on('resize', function(){
      // remove all d3 elements prior to redrawing them on the screen after a resize
      d3.select(".ratingsvg").remove();
      d3.selectAll(".tooltip").remove();
      //allow for dynamic position of key
      $scope.$apply(function(){
        $scope.resize();        
      });
      // redraw the graph
      scoresGraph.initialize($rootScope, $scope, $scope.sizing);
    });

    //toggling of dropdown menu for small devices
    $scope.showDropdown = false;
    $scope.toggleDropdown = function(){
      console.log('toggle');
      $scope.showDropdown = !$scope.showDropdown;
    };

  }]);

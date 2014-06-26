'use strict';

angular.module('app.ratinghistory', [])
  .controller('RatingHistoryCtrl', ['$scope','ratingHistoryMethods', function ($scope, ratingHistoryMethods) {
    
    var renderChart = function(scores) {
      var data = [];
      angular.forEach(scores, function(value, key){
        data.push({
          date: value.date,
          x:    value.x,
          y:    value.y
        });
      });

      // if month flag set,split data into buckets for last 4 weeks
      // for each sum up, if date difference > 1week, put into second sum
      // if date difference > 2 weeks, put into second bucket sum
      console.log(data);

      Morris.Line({
        element: 'line-example',
        data: data,
        xkey: 'date',
        xLabelAngle: 90,
        ykeys: ['x', 'y'],
        labels: ['Company Success', 'Personal success']
      });
    };

    // GET user score
    ratingHistoryMethods.getUserScores() 
      .success(function(data){
        var scores = data.scores;
        // console.log(scores);
        renderChart(scores.slice(0,6));
      });


  }])
  .factory('ratingHistoryMethods', ['$rootScope', '$http', function($rootScope, $http){
    return {
      getUserScores: function(){
        return $http({
          method: 'GET',
          url: '/api/users/' + $rootScope.currentUser.id + '/scores'
        });
      }
    };
  }]);
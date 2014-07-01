'use strict';

angular.module('app.ratinghistory', [])
  .controller('RatingHistoryCtrl', ['$scope','ratingHistoryMethods', function ($scope, ratingHistoryMethods) {
    var dayDifference = function(date){
        return Math.floor((new Date() - new Date(date)) /  (86400 * 1000));
    };

    $scope.dateRange = undefined;

    $scope.changeDateRange = function(flag){
      // event.srcElement.blur();
      $scope.dateRange = flag;
      $scope.renderChart($scope.scores, $scope.dateRange);
    };

    $scope.renderChart = function(scores, flag) {
      console.log(scores);
      var data = [];
      //if chart remove chart and render
      d3.select('#line-example').html("");
      // if month flag set,split data into buckets for last 4 weeks
      var weekOrMonth = 1;
      var dayCount = 1;
      var sumX = 0;
      var sumY = 0;
      var lastDate;

      var dataLabels = flag ? ['Company success average', 'Personal success average']: ['Company success', 'Personal success'];

      var addData = function(){
        if(sumX || sumY){
          data.push({
            date: lastDate,
            x: Math.floor(sumX / dayCount),
            y: Math.floor(sumY / dayCount)
          });
        }
        weekOrMonth++;
        sumX = 0;
        sumY = 0;
        dayCount = 0;
      };

      scores.forEach(function(value, key){
        if(flag === 'month' && weekOrMonth === 5){
          return;
        } else if(flag === 'month' && (dayDifference(value.date) > weekOrMonth * 7)){
          addData();
        } else if(flag === 'month'){
          dayCount++;
          sumX += value.x;
          sumY += value.y;
          lastDate = value.date;
        } else if(!flag && dayDifference(value.date) > 7){
          return;
        } else if(flag === '3months' && weekOrMonth < 4 && (dayDifference(value.date) > weekOrMonth * 30)){
          addData();
        } else if(flag === '3months' && weekOrMonth < 4){
          dayCount++;
          sumX += value.x;
          sumY += value.y;
          lastDate = value.date;
        } else if(weekOrMonth > 3){
          return;
        }

        if(!flag){
          data.push({
            date: value.date,
            x:    value.x,
            y:    value.y
          });
        }

      });

      Morris.Line({
        element: 'line-example',
        data: data,
        hideHover: true,
        xkey: 'date',
        xLabelAngle: 90,
        ykeys: ['x', 'y'],
        labels: dataLabels,
        lineColors: ['#ff6633', '#1255c0'],
        pointSize: 10
      });
    };

    // GET user score
    ratingHistoryMethods.getUserScores()
      .success(function(data){
        var scores = data.scores;
        $scope.scores = scores;
        $scope.renderChart(scores);
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
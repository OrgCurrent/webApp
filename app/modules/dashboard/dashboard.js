'use strict';

angular.module('app.dashboard', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'mainChart', 'formatUsers', function ($scope, $http, $location, $window, mainChart, formatUsers) {
    console.log($scope.currentUser);

    //container for sizing parameters
    $scope.sizing = {};
    //display statuses
    $scope.showFisheye = true;
    $scope.showSidebox = true;
    //mouse position listener for fisheye
    $scope.mouse = [0, 0];

    $scope.setDateRange = function(days){
      if(days){
        $scope.dateRange = days;  
      }else{
        $scope.dateRange = undefined;
      }
      $scope.renderChart();
    };

    $scope.renderChart = function(){
      //margin sizing subject to changes
      $scope.sizing.margin = {top: 40, right: 40, bottom: 40, left: 40};

      $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 160) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
      
      mainChart.render($scope.users, $scope.sizing, $scope);
    };
    //listener for window scope resize
    $window.addEventListener('resize', function(){
      $scope.renderChart();
    });

    $scope.toggleSidebox = function(){
      $scope.showSidebox = !$scope.showSidebox;
      if(!$scope.showSidebox){
        d3.select('.board-wrapper')
          .attr('class', 'board-wrapper col-sm-11 col-md-offset-1');
        $scope.renderChart();
      }else{
        d3.select('.board-wrapper')
          .attr('class', 'board-wrapper col-sm-9');
        $scope.renderChart();
      }
    };

    //fetch scores from server
    $http({
      method: 'GET',
      url: '/api/companies/' + $scope.currentUser.company + '/scores'
    })
    .success(function(data){
      $scope.users = formatUsers(data);
      $scope.renderChart();
    })
    .error(function(err){
      console.error(err);
    });
  }]);

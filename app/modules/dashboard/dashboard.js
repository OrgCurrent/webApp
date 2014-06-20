'use strict';

angular.module('app.dashboard', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'mainChart', 'formatUsers', function ($scope, $http, $location, $window, mainChart, formatUsers) {

    $scope.sizing = {
      margin: {top: 40, right: 40, bottom: 40, left: 40},
    };
    $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
    $scope.sizing.height = ($window.innerHeight - 160) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;

    //listener for window re$scope.sizing

    $scope.resizeChart = function(){
      $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 160) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
      mainChart.render($scope.users, $scope.sizing, $scope);
    };
    
    $window.addEventListener('resize', function(){
      $scope.resizeChart();
    });

    $scope.mousePosition = [0, 0];
    $scope.showFisheye = true;
    $scope.showSidebox = true;

    $scope.toggleSidebox = function(){
      $scope.showSidebox = !$scope.showSidebox;
      if(!$scope.showSidebox){
        // d3.select('.sidebox-wrapper')
        //   .style('display', 'none');
        d3.select('.board-wrapper')
          .attr('class', 'board-wrapper col-sm-11 col-md-offset-1');
        $scope.resizeChart();
        mainChart.render($scope.users, $scope.sizing, $scope);
      }else{
        // d3.select('.sidebox-wrapper')
        //   .style('display', null);

          // .attr('class', 'sidebox-wrapper col-sm-3');
        d3.select('.board-wrapper')
          .attr('class', 'board-wrapper col-sm-9');
        $scope.resizeChart();
        mainChart.render($scope.users, $scope.sizing, $scope);

      }
    }

    //backend data
    $http({
      method: 'GET',
      url: '/api/companies/' + $scope.currentUser.company + '/scores'
    })
    .success(function(data){
      $scope.users = formatUsers(data);
      $scope.resizeChart();
      mainChart.render($scope.users, $scope.sizing, $scope);
    })
    .error(function(err){
      console.error(err);
    });
  }]);

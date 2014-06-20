'use strict';

angular.module('app.dashboard', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'mainChart', 'formatUsers', function ($scope, $http, $location, $window, mainChart, formatUsers) {

    console.log($scope.currentUser);

    $scope.sizing = {
      margin: {top: 40, right: 40, bottom: 40, left: 40},
    };
    $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
    $scope.sizing.height = ($window.innerHeight - 120) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;

    //listener for window re$scope.sizing
    $window.addEventListener('resize', function(){
      $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 120) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
      mainChart.render($scope.users, $scope.sizing, $scope);
    });

    $scope.mousePosition = [0, 0];
    $scope.showFisheye = true;

    //backend data
    $http({
      method: 'GET',
      url: '/api/companies/' + $scope.currentUser.company + '/scores'
    })
    .success(function(data){
      $scope.users = formatUsers(data);
      mainChart.render($scope.users, $scope.sizing, $scope);
    })
    .error(function(err){
      console.error(err);
    });
  }]);

'use strict';

angular.module('app.dashboard', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'formatUsers', '$timeout', function ($scope, $http, $location, $window, formatUsers, $timeout) {

    //container for sizing parameters
    $scope.sizing = {};
    $scope.resize = function(){
      $scope.sizing.margin = {top: 30, right: 40, bottom: 30, left: 30};
      $scope.sizing.width = $('.board-wrapper').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 160) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
    };
    $scope.renderChart = function(){
      $scope.resize();
      $scope.$broadcast('render');    
      //dynamic height for loading div
      $('.board-loading').css('height', $scope.sizing.height);  
    };
    //listener for window scope resize
    $window.addEventListener('resize', $scope.renderChart);
    $scope.$on('$destroy', function(event){
      $window.removeEventListener('resize');
    });

    //display options
    $scope.options = {
      displayMode: 'fisheye',
      showFisheye: true,
      showSidebox: true,
      dateRange: 31,
      snapshotDate: undefined,
      mousePos: [0, 0],
    };

    $scope.setDisplayMode = function(mode){
      $scope.options.displayMode = mode;
      $scope.renderChart();
    };

    $scope.setDateRange = function(range){
      //$scope.users[2] is array of average scores
      $scope.options.dateRange = range || $scope.users[2].length;
      $scope.renderChart();
    };

    $scope.toggleSidebox = function(){
      $scope.options.showSidebox = !$scope.options.showSidebox;
      d3.select('.board-wrapper')
        .attr('class', function(){
          return $scope.options.showSidebox ? 
            'board-wrapper col-sm-9' :
            'board-wrapper col-sm-11 col-md-offset-1';
        });
      $scope.renderChart();
    };

    //toggle dropdown menu for small devices
    $scope.showDropdown = false;
    $scope.toggleDropdown = function(){
      $scope.showDropdown = !$scope.showDropdown;
    };
    
    // $scope.renderLoading = function(){
    //   $scope.resize();
    //   //dynamic height for loading div
    //   $('.board-loading').css('height', $scope.sizing.height);
    // };

    $scope.loadingChart = true;
    // $scope.renderLoading();

    //fetch scores from server; delay 1ms to let ng-include navbar load first
    $timeout(function(){
      $http({
        method: 'GET',
        url: '/api/companies/' + $scope.currentUser.company + '/scores'
      })
      .success(function(data){
        $scope.loadingChart = false;
        $scope.users = formatUsers(data);
        //$scope.users[2] is array of average scores
        $scope.options.dateRange = $scope.users[2].length;
        $scope.renderChart();
      })
      .error(function(err){
        console.error(err);
      });      
    }, 1);

  }]);

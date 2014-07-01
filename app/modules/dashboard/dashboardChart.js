angular.module('app.dashboard.chart', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardChartCtrl', ['$scope', '$http', '$location', '$window', 'MainChart', 'formatUsers', function ($scope, $http, $location, $window, MainChart, formatUsers) {

    $scope.$on('render', function(){
      MainChart.render($scope.users, $scope.sizing, $scope.options);
    });

  }]);

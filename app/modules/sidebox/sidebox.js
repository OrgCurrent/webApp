'use strict';

angular.module('happyMeterApp')
  .controller('SideboxCtrl', ['$rootScope', '$scope', '$location', 'Auth',
   function ($rootScope, $scope, $location, Auth) {

    var role = $scope.currentUser ? $scope.currentUser.role : undefined;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Dashboard',
      'link': '/dashboard',
      'hide': (role === 'employee')
    }, {
      'title': 'Analytics',
      'hide': ($location.path() !== '/dashboard')
    }, {
      'title': 'Rating',
      'link': '/rating',
      'hide': (role === 'executive')
    }, {
      'title': 'Rating History',
      'link' : '/ratinghistory',
      'hide': (role === 'executive')
    }, {
      'title': 'Rewards',
      'link' : '/rewards',
      'hide': (role === 'executive')
    }, {
      'title': 'Settings',
      'link': '/settings'
    }, {
      'title': 'Invite Colleagues',
      'link': '/invite'
    }];

    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.showSidebox = true;
    $scope.toggleSidebox = function(){
          $scope.showSidebox = !$scope.showSidebox;
          if(!$scope.showSidebox){
            d3.select('.header')
              .attr('class', 'board-wrapper col-sm-11 col-md-offset-1');
            // $scope.renderChart();
          }else{
            d3.select('.header')
              .attr('class', 'board-wrapper col-sm-9');
            // $scope.renderChart();
          }
        };
  }]);


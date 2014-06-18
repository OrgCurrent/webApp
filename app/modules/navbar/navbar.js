'use strict';

angular.module('happyMeterApp')
  .controller('NavbarCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {

    var role = $scope.currentUser ? $scope.currentUser.role : undefined;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Dashboard',
      'link': '/dashboard',
      'hide': (role === 'employee')
    }, {
      'title': 'Rating',
      'link': '/rating',
      'hide': (role === 'executive')
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  }]);

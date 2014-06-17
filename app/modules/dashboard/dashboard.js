'use strict';

angular.module('app.dashboard', ['dashboardGraphics','mockData'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'mainChart', 'generateUsers', 'formatUsers', function ($scope, $http, $location, $window, mainChart, generateUsers, formatUsers) {

    console.log($scope.currentUser);

    var sizing = {
      margin: {top: 10, right: 80, bottom: 40, left: 80},
    };
    sizing.width = $('.board').width() - sizing.margin.left - sizing.margin.right;
    sizing.height = ($window.innerHeight - 240) - sizing.margin.top - sizing.margin.bottom;
    console.log('here here');
    console.log($('.board').height());

    //listener for window resizing
    $window.addEventListener('resize', function(){
      sizing.width = $('.board').width() - sizing.margin.left - sizing.margin.right;
      sizing.height = ($window.innerHeight - 240) - sizing.margin.top - sizing.margin.bottom;
      mainChart.render($scope.users, sizing, $scope);
    });


    //mock data
    // var data = generateUsers(10, 20);
    // mainChart.initialize(data, 0, $scope);

    //backend data
    $http({
      method: 'GET',
      url: '/api/companies/' + $scope.currentUser.company + '/scores'
    })
    .success(function(data){
      console.log(data);
      $scope.users = formatUsers(data);
      mainChart.render($scope.users, sizing, $scope);
    })
    .error(function(err){
      console.error(err);
    });

    //Deprecated
    // // On click, update the x-axis.
    // function click(event) {
    //   console.log(d3.mouse);
    //   console.log(123);
    //   var n = averages.length - 1,
    //       i = Math.floor(Math.random() * n / 2),
    //       j = i + Math.floor(Math.random() * n / 2) + 1;
    //   x.domain([averages[i].date, averages[j].date]);
    //   var t = svg.transition().duration(750);
    //   t.select(".x.axis").call(xAxis);
    //   t.select(".area").attr("d", area(averages));
    //   t.select("#lineA").attr("d", lineA(averages));
    //   t.select("#lineB").attr("d", lineB(averages));
    // }
  }]);

  /*{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    x: Number,
    y: Number
  }*/

'use strict';

angular.module('app.dashboard', ['dashboardGraphics','mockData'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', 'mainChart', 'generateUsers', function ($scope, $http, $location, mainChart, generateUsers) {

    var margin = {top: 10, right: 80, bottom: 80, left: 80};

    var data = generateUsers(50, 10);
    mainChart.initialize(data, 0, $scope); 

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

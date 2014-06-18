'use strict';

angular.module('app.dashboard', ['dashboardGraphics', 'formatUsers'])
  .controller('DashboardCtrl', ['$scope', '$http', '$location', '$window', 'mainChart', 'formatUsers', function ($scope, $http, $location, $window, mainChart, formatUsers) {

    console.log($scope.currentUser);

    $scope.sizing = {
      margin: {top: 10, right: 80, bottom: 40, left: 80},
    };
    $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
    $scope.sizing.height = ($window.innerHeight - 120) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;

    //listener for window re$scope.sizing
    $window.addEventListener('resize', function(){
      $scope.sizing.width = $('.board').width() - $scope.sizing.margin.left - $scope.sizing.margin.right;
      $scope.sizing.height = ($window.innerHeight - 120) - $scope.sizing.margin.top - $scope.sizing.margin.bottom;
      mainChart.render($scope.users, $scope.sizing, $scope);
    });

    $scope.mousePosition = [50, 0];
    $scope.showFisheye = false;

    //mock data
    // var data = generateUsers(10, 20);
    // mainChart.initialize(data, 0, $scope);

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
  }])
  // .factory('formatUsers', [function(){
  //   return function(newUsers){

  //     var parse = d3.time.format("%d-%b-%y").parse;
  //     var format = d3.time.format("%d-%b-%y");

  //     //generate random user data
  //     // var newUsers = [];
  //     // for(var i = 0; i < n; i++){
  //     //   newUsers.push(randomUser(s));
  //     // }

  //     var sortedScores = {};
  //     for(var i = 0; i < newUsers.length; i++){
  //       for(var j = 0; j < newUsers[i].scores.length; j++){
  //         var score = newUsers[i].scores[j];
  //         score.date = new Date(score.date);
  //         var dataStr = format(score.date);
  //         if(sortedScores[dataStr]){

  //           sortedScores[dataStr].push({
  //             x: score.x,
  //             y: score.y,
  //             user_id: newUsers[i]._id
  //           });
  //         }else{
  //           sortedScores[dataStr] = [{
  //             x: score.x,
  //             y: score.y,
  //             user_id: newUsers[i]._id
  //           }];
  //         }
  //       }
  //     }

  //     var averageScores = [];
  //     for(var date in sortedScores){
  //       var xSum = 0;
  //       var ySum = 0;
  //       var count = sortedScores[date].length;
  //       for(var i = 0; i < count; i++){
  //         xSum += sortedScores[date][i].x;
  //         ySum += sortedScores[date][i].y;
  //       }
  //       averageScores.push({
  //         date: parse(date),
  //         x: xSum / count,
  //         y: ySum / count
  //       });
  //     }

  //     averageScores.sort(function(obj1,obj2){
  //       return obj1.date - obj2.date;
  //     });

  //     return [newUsers, sortedScores, averageScores]; 
  //   };
  // }]);

  /*{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    x: Number,
    y: Number
  }*/

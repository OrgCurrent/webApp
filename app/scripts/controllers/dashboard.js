'use strict';

angular.module('happyMeterApp')
  .controller('DashboardCtrl', ['$scope', '$http', '$location', 'randomUser', 'generateUsers', function ($scope, $http, $location, randomUser, generateUsers) {

    var margin = {top: 10, right: 80, bottom: 80, left: 80},
        width = $('.container').width() - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var parse = d3.time.format("%d-%b-%y").parse;
    var format = d3.time.format("%d-%b-%y");

    var data = generateUsers(50, 10);
    var users = data[0];
    var scores = data[1];
    var averages = data[2];

    $scope.snapshotDate = format(averages[0].date); 

    // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
    var x = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        // xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true),
        xAxis = d3.svg.axis().scale(x).ticks(6).tickSubdivide(true),
        yAxis = d3.svg.axis().scale(y).ticks(4).orient("right");

    // An area generator, for the light fill.
    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.b); });

    // A line generator, for the dark stroke.
    var lineA = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.a); });

    var lineB = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.b); });

    // Compute the minimum and maximum date, and the maximum a/b.
    x.domain([averages[0].date, averages[averages.length - 1].date]);
    y.domain([0, d3.max(averages, function(d) { return Math.max(d.a, d.b); })]).nice();

    //FISHEYE

    var userScoresByDate = users.slice();
    // for(var i = 0; i < userScoresByDate.length)

    var fisheyeData = {};

    var randomColor = function(){
      return 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    };

    var updateFisheye = function(date){

      // fisheye.attr('transform', 'translate()')
      var scorePoints = fisheye.selectAll('circle')
          .data(userScoresByDate);

      scorePoints.enter()
          .append('circle')
          .attr('fill', function(d){return randomColor();})
          .attr('cx', function(d){
            for(var i = 0; i < d.scores.length; i++){
              if(d.scores[i].date - date > 0){
                return i > 0 ? d.scores[i-1].a * 2: d.scores[i].a * 2;
              }
            }
            return d.scores[d.scores.length - 1].a * 2;
          })
          .attr('cy', function(d){
            for(var i = 0; i < d.scores.length; i++){
              if(d.scores[i].date - date > 0){
                return i > 0 ? 200 - d.scores[i-1].b * 2: 200 - d.scores[i].b * 2;
              }
            }
            return 200 - d.scores[d.scores.length - 1].b * 2;
          })
          .attr('r', 5);

      scorePoints.transition()
          .attr('cx', function(d){
            for(var i = 0; i < d.scores.length; i++){
              if(d.scores[i].date - date > 0){
                return i > 0 ? d.scores[i-1].a * 2: d.scores[i].a * 2;;
              }
            }
            return d.scores[d.scores.length - 1].a * 2;
          })
          .attr('cy', function(d){
            for(var i = 0; i < d.scores.length; i++){
              if(d.scores[i].date - date > 0){
                return i > 0 ? 200 - d.scores[i-1].b * 2: 200 - d.scores[i].b * 2;
              }
            }
            return 200 - d.scores[d.scores.length - 1].b * 2;
          })
          .duration(100);

      scorePoints.exit()
          .transition()
          .attr('opacity', 0)
          .duration(500)
          .remove()
    };

    //MAIN BOARD

    // Add an SVG element with the desired dimensions and margin.
    var svg = d3.select(".board").append("svg")
        .attr("id", "board")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mousemove", function(){
          mousePosition = d3.mouse(this);
          snapshotUpdate();
        })
        .on('click', function(){
          var fisheye = svg.select('.fisheye');
          if(fisheye.attr()){}
        });

    // Add the clip path.
    var clip = svg.append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    // Add the area path.
    svg.append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")
        .attr("d", area(averages));

    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the y-axis.
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);

    // Add the lineA path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", "lineA")
        .attr("clip-path", "url(#clip)")
        .attr("d", lineA(averages));

    // Add the line path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", "lineB")
        .attr("clip-path", "url(#clip)")
        .attr("d", lineB(averages));

    // Add a small label for the symbol name.
    svg.append("text")
        .attr("x", width - 6)
        .attr("y", height - 6)
        .style("text-anchor", "end")
        .text('hihi');

    var mousePosition = [50, 0];

    var snapshotLine = svg.append("line")
        .attr("class", "snapshot-line")
        .attr("x1", 50)
        .attr("x2", 50)
        .attr("y1", 0)
        .attr("y1", height);

    var fisheye = d3.select('.board').append('svg')
        .attr('id', 'fisheye')
        // .style('display', 'none')
        .attr('width', 200)
        .attr('height', 200);

    var snapshotUpdate = function(){
      snapshotLine.data(mousePosition)
          .attr("x1", mousePosition[0])
          .attr("x2", mousePosition[0]);

      console.log(snapshotLine.attr('x1'));

      var xRatio = mousePosition[0] / width;
      var xIndex = Math.floor(averages.length * xRatio);
      var date = averages[xIndex].date;
      var dateStr = format(date);

      $scope.$apply(function(){
        $scope.snapshotDate = dateStr;
      });

      updateFisheye(date);

      console.log(scores[dateStr]);
    };

    // d3.timer(snapshotUpdate);

        
    // On click, update the x-axis.
    function click(event) {
      console.log(d3.mouse);
      console.log(123);
      var n = averages.length - 1,
          i = Math.floor(Math.random() * n / 2),
          j = i + Math.floor(Math.random() * n / 2) + 1;
      x.domain([averages[i].date, averages[j].date]);
      var t = svg.transition().duration(750);
      t.select(".x.axis").call(xAxis);
      t.select(".area").attr("d", area(averages));
      t.select("#lineA").attr("d", lineA(averages));
      t.select("#lineB").attr("d", lineB(averages));
    }
  }])

  .factory('randomUser', function(){
    return function(numOfScores){
      var user = {
        _id: Math.floor(Math.random() * 10000000000).toString(),
        // date: new Date(2011, month, date),
        scores: []
      };
      for(var i = 0; i < numOfScores; i++){
        var month = Math.floor(Math.random() * 5);
        var day = Math.floor(Math.random() * 31) + 1;
        var date = new Date(2011, month, day);
        user.scores.push({
          date: date,
          a: Math.random() * 100,
          b: Math.random() * 100          
        });
        user.scores.sort(function(s1, s2){
          return s1.date - s2.date;
        });
      }
      return user;
    };
  })

  .factory('generateUsers', ['randomUser', function(randomUser){
    return function(n, s){

      var parse = d3.time.format("%d-%b-%y").parse;
      var format = d3.time.format("%d-%b-%y");

      //generate random user data
      var newUsers = [];
      for(var i = 0; i < n; i++){
        newUsers.push(randomUser(s));
      }

      var sortedScores = {};
      for(var i = 0; i < newUsers.length; i++){
        for(var j = 0; j < newUsers[i].scores.length; j++){
          var score = newUsers[i].scores[j];
          var dataStr = format(score.date);
          if(sortedScores[dataStr]){

            sortedScores[dataStr].push({
              a: score.a,
              b: score.b,
              user_id: newUsers[i]._id
            });
          }else{
            sortedScores[dataStr] = [{
              a: score.a,
              b: score.b,
              user_id: newUsers[i]._id
            }];
          }
        }
      }
      var averageScores = [];
      for(var date in sortedScores){
        var aSum = 0;
        var bSum = 0;
        var count = sortedScores[date].length;
        for(var i = 0; i < count; i++){
          aSum += sortedScores[date][i].a;
          bSum += sortedScores[date][i].b;
        }
        averageScores.push({
          date: parse(date),
          a: aSum / count,
          b: bSum / count
        });
      }

      averageScores.sort(function(obj1,obj2){
        return obj1.date - obj2.date;
      });

      return [newUsers, sortedScores, averageScores]; 
    };
  }]);


  /*{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    x: Number,
    y: Number
  }*/

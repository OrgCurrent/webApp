'use strict';

angular.module('happyMeterApp')
  .controller('DashboardCtrl', ['$scope', '$http', 'scoresData', '$location', function ($scope, $http, scoresData, $location) {

    var values = scoresData.scores.reverse();

    var zoomedIn = false;
    $scope.snapshotDate = values[0].date; 
    
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var parse = d3.time.format("%d-%b-%y").parse;
    var format = d3.time.format("%d-%b-%y");

    angular.forEach(values, function(d){
      d.date = parse(d.date);
    });

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
    x.domain([values[0].date, values[values.length - 1].date]);
    y.domain([0, d3.max(values, function(d) { return Math.max(d.a, d.b); })]).nice();

    // debugger;

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
          // console.log(d3.mouse(this));
        });

    // svg.on("mousemove", function(){
    //   console.log(d3.mouse(this));
    // })

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
        .attr("d", area(values));

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
        .attr("d", lineA(values));

    // Add the line path.
    svg.append("path")
        .attr("class", "line")
        .attr("id", "lineB")
        .attr("clip-path", "url(#clip)")
        .attr("d", lineB(values));

    // Add a small label for the symbol name.
    svg.append("text")
        .attr("x", width - 6)
        .attr("y", height - 6)
        .style("text-anchor", "end")
        .text(values[0].symbol);

    var mousePosition = [50, 0];

    var snapshotLine = svg.append("line")
        .attr("class", "snapshot-line")
        .attr("x1", 50)
        .attr("x2", 50)
        .attr("y1", 0)
        .attr("y1", height);

    var snapshotUpdate = function(){
      snapshotLine.data(mousePosition)
          .attr("x1", mousePosition[0])
          .attr("x2", mousePosition[0]);

      var xRatio = mousePosition[0] / width;
      var xIndex = Math.floor(values.length * xRatio);

      $scope.$apply(function(){
        $scope.snapshotDate = format(values[xIndex].date);
      });

      console.log($scope.snapshotDate);
    };

    // d3.timer(snapshotUpdate);

        
    // On click, update the x-axis.
    function click(event) {
      console.log(d3.mouse);
      console.log(123);
      var n = values.length - 1,
          i = Math.floor(Math.random() * n / 2),
          j = i + Math.floor(Math.random() * n / 2) + 1;
      x.domain([values[i].date, values[j].date]);
      var t = svg.transition().duration(750);
      t.select(".x.axis").call(xAxis);
      t.select(".area").attr("d", area(values));
      t.select("#lineA").attr("d", lineA(values));
      t.select("#lineB").attr("d", lineB(values));
    }
  }])

  .constant('scoresData', {
    scores: [
      {date: '1-May-12', a: 40, b: 60},
      {date: '30-Apr-12', a: 40, b: 60},
      {date: '27-Apr-12', a: 40, b: 60},
      {date: '26-Apr-12', a: 40, b: 60},
      {date: '25-Apr-12', a: 40, b: 60},
      {date: '24-Apr-12', a: 40, b: 60},
      {date: '23-Apr-12', a: 40, b: 60},
      {date: '20-Apr-12', a: 40, b: 60},
      {date: '19-Apr-12', a: 50, b: 30},
      {date: '18-Apr-12', a: 50, b: 30},
      {date: '17-Apr-12', a: 50, b: 30},
      {date: '16-Apr-12', a: 50, b: 30},
      {date: '13-Apr-12', a: 50, b: 30},
      {date: '12-Apr-12', a: 50, b: 30},
      {date: '11-Apr-12', a: 50, b: 30},
      {date: '10-Apr-12', a: 50, b: 30},
      {date: '9-Apr-12', a: 50, b: 30},
      {date: '5-Apr-12', a: 50, b: 30},
      {date: '4-Apr-12', a: 50, b: 30},
      {date: '3-Apr-12', a: 50, b: 30},
      {date: '2-Apr-12', a: 50, b: 30},
      {date: '30-Mar-12', a: 50, b: 30},
      {date: '29-Mar-12', a: 50, b: 30},
      {date: '28-Mar-12', a: 50, b: 30},
      {date: '27-Mar-12', a: 50, b: 30},
      {date: '26-Mar-12', a: 50, b: 30},
      {date: '23-Mar-12', a: 50, b: 30},
      {date: '22-Mar-12', a: 50, b: 30},
      {date: '21-Mar-12', a: 50, b: 30},
      {date: '20-Mar-12', a: 50, b: 30},
      {date: '19-Mar-12', a: 50, b: 30},
      {date: '16-Mar-12', a: 50, b: 30},
      {date: '15-Mar-12', a: 50, b: 30},
      {date: '14-Mar-12', a: 50, b: 30},
      {date: '13-Mar-12', a: 50, b: 30},
      {date: '12-Mar-12', a: 50, b: 30},
      {date: '9-Mar-12', a: 50, b: 30},
      {date: '8-Mar-12', a: 50, b: 30},
      {date: '7-Mar-12', a: 50, b: 30},
      {date: '6-Mar-12', a: 50, b: 30},
      {date: '5-Mar-12', a: 50, b: 30},
      {date: '2-Mar-12', a: 50, b: 30},
      {date: '1-Mar-12', a: 50, b: 30},
      {date: '29-Feb-12', a: 50, b: 30},
      {date: '28-Feb-12', a: 50, b: 30},
      {date: '27-Feb-12', a: 50, b: 30},
      {date: '24-Feb-12', a: 50, b: 30},
      {date: '23-Feb-12', a: 50, b: 30},
      {date: '22-Feb-12', a: 50, b: 30},
      {date: '21-Feb-12', a: 50, b: 30},
      {date: '17-Feb-12', a: 50, b: 30},
      {date: '16-Feb-12', a: 50, b: 30},
      {date: '15-Feb-12', a: 50, b: 30},
      {date: '14-Feb-12', a: 50, b: 30},
      {date: '13-Feb-12', a: 50, b: 30},
      {date: '10-Feb-12', a: 50, b: 30},
      {date: '9-Feb-12', a: 50, b: 30},
      {date: '8-Feb-12', a: 50, b: 30},
      {date: '7-Feb-12', a: 50, b: 30},
      {date: '6-Feb-12', a: 50, b: 30},
      {date: '3-Feb-12', a: 50, b: 30},
      {date: '2-Feb-12', a: 50, b: 30},
      {date: '1-Feb-12', a: 50, b: 30},
      {date: '31-Jan-12', a: 50, b: 30},
      {date: '30-Jan-12', a: 50, b: 30},
      {date: '27-Jan-12', a: 50, b: 30},
      {date: '26-Jan-12', a: 50, b: 30},
      {date: '25-Jan-12', a: 50, b: 30},
      {date: '24-Jan-12', a: 50, b: 30},
      {date: '23-Jan-12', a: 50, b: 30},
      {date: '20-Jan-12', a: 50, b: 30},
      {date: '19-Jan-12', a: 50, b: 30},
      {date: '18-Jan-12', a: 50, b: 30},
      {date: '17-Jan-12', a: 50, b: 30},
      {date: '13-Jan-12', a: 50, b: 30},
      {date: '12-Jan-12', a: 50, b: 30},
      {date: '11-Jan-12', a: 50, b: 30},
      {date: '10-Jan-12', a: 50, b: 30},
    ]
  })

  /*{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    x: Number,
    y: Number
  }*/

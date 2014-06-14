'use strict';

angular.module('dashboardGraphics', [])

  .factory('mainChart', ['fisheyeChart', 'timeFormat', function(fisheyeChart, timeFormat){
    return {
      initialize: function(data, margin, scope){
      
        var margin = {top: 10, right: 80, bottom: 80, left: 80},
            width = $('.container').width() - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;

        var users = data[0];
        var scores = data[1];
        var averages = data[2];

        console.log(averages);
        //weekly averages test
        var weeklyAverages = [];
        for(var i = 0; i < averages.length; i++){

        }

        scope.snapshotDate = timeFormat.format(averages[0].date);

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

        // A line generator
        var lineA = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.a); });

        // var lineA = d3.svg.line()
        //     .interpolate("monotone")
        //     .x(function(d, i) {
        //       if(i % 7 === 0){
        //         return x(d.date);
        //       }else{
        //         return x(d)
        //       }
        //     })
        //     .y(function(d) { return y(d.a); });

        //B line generator
        var lineB = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.b); });

        // Compute the minimum and maximum date, and the maximum a/b.
        x.domain([averages[0].date, averages[averages.length - 1].date]);
        y.domain([0, d3.max(averages, function(d) { return Math.max(d.a, d.b); })]).nice();

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

        fisheyeChart.initialize();

        var snapshotUpdate = function(){
          snapshotLine.data(mousePosition)
              .attr("x1", mousePosition[0])
              .attr("x2", mousePosition[0]);

          var xRatio = mousePosition[0] / width;
          //weekly unit
          var xIndex = Math.floor(averages.length * xRatio / 7) * 7;
          var date = averages[xIndex].date;
          var dateStr = timeFormat.format(date);

          scope.$apply(function(){
            scope.snapshotDate = dateStr;
          });
          
          fisheyeChart.update(date, users, mousePosition);
        };
      }
    };
  }])

  .factory('fisheyeChart', function(){
    return {
      initialize: function(){
        var fisheye = d3.select('.board').append('svg')
          .attr('id', 'fisheye')
          // .style('display', 'none')
          .attr('width', 200)
          .attr('height', 200);
      },
      update: function(date, users, mousePosition){

        var fisheye = d3.select('#fisheye');

        // fisheye.style('background-color', 'red');
        // to be refactored
        fisheye.style('left', mousePosition[0]);

        var randomColor = function(){
          return 'rgb(' + Math.floor(Math.random() * 256) + ',' + 255 + ',' + Math.floor(Math.random() * 256) + ')';
        };

        var scorePoints = fisheye.selectAll('circle')
            .data(users);

        //new score entry
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

        //score updates
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

        //old score exit
        scorePoints.exit()
          .transition()
          .attr('opacity', 0)
          .duration(500)
          .remove();
      }
    };
  })

  .factory('timeFormat', function(){
    return {
      parse: d3.time.format(""),
      format: d3.time.format("%d-%b-%y")
    };
  });

  //not used now
  // .directive('mainChart', function(){
  //   var link = function(scope, element, attr){
  //     var svg = d3.select(element[0])
  //       .append('svg')
  //       .attr('class', 'main-chart');
  //       // .attr("width", width + margin.left + margin.right)
        
  //     console.log(svg);
  //   };

  //   return {
  //     restrict: 'E',
  //     link: link,
  //     scope: true
  //   };

  // });
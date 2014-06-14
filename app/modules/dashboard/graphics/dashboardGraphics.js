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
        // var weeklyAverages = [];
        // for(var i = 6; i < averages.length; i+= 7){
        //   var weekAverageA = 0;
        //   var weekAverageB = 0;
        //   for(var j = i - 6; j <= i; j++){
        //     weekAverageA += averages[j].a / 7;
        //     weekAverageB += averages[j].b / 7;
        //   }
        //   weeklyAverages.push({
        //     a: weekAverageA,
        //     b: weekAverageB,
        //     date: averages[i].date
        //   });
        // }
        var smoothAverages = [];
        for(var i = 0; i < averages.length; i++){
          var avgNumber = Math.min(i+1, 7);
          var weekAverageA = 0;
          var weekAverageB = 0;
          for(var j = i - avgNumber + 1; j <= i; j++){
            weekAverageA += averages[j].a / avgNumber;
            weekAverageB += averages[j].b / avgNumber;
          }
          smoothAverages.push({
            a: weekAverageA,
            b: weekAverageB,
            date: averages[i].date
          });
        }

        console.log(smoothAverages);

        scope.snapshotDate = timeFormat.format(smoothAverages[0].date);

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

        //B line generator
        var lineB = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.b); });

        // Compute the minimum and maximum date, and the maximum a/b.
        x.domain([smoothAverages[0].date, smoothAverages[smoothAverages.length - 1].date]);
        y.domain([0, d3.max(smoothAverages, function(d) { return Math.max(d.a, d.b); })]).nice();

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
            .attr("d", area(smoothAverages));

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
            .attr("d", lineA(smoothAverages));

        // Add the line path.
        svg.append("path")
            .attr("class", "line")
            .attr("id", "lineB")
            .attr("clip-path", "url(#clip)")
            .attr("d", lineB(smoothAverages));

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
          var xIndex = Math.floor(smoothAverages.length * xRatio);
          var date = smoothAverages[xIndex].date;
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
            var aSum = 0;
            var count = 0;
            for(var i = 0; i < d.scores.length; i++){
              if(date - d.scores[i].date <= 86400 * 1000 * 7 && date - d.scores[i].date >= 0){
                aSum += d.scores[i].a;
                count++;
              }
            }
            return count > 0 ? aSum / count * 2 : 100;
          })
          // .attr('cx', function(d){
          //   for(var i = 0; i < d.scores.length; i++){
          //     var 
          //     if(d.scores[i].date - date > 0){
          //       return i > 0 ? d.scores[i-1].a * 2: d.scores[i].a * 2;
          //     }
          //   }
          //   return d.scores[d.scores.length - 1].a * 2;
          // })
          .attr('cy', function(d){
            var bSum = 0;
            var count = 0;
            for(var i = 0; i < d.scores.length; i++){
              if(date - d.scores[i].date <= 86400 * 1000 * 7 && date - d.scores[i].date >= 0){
                bSum += d.scores[i].b;
                count++;
              }
            }
            return count > 0 ? 200 - bSum / count * 2 : 100;
          })
          // .attr('cy', function(d){
          //   for(var i = 0; i < d.scores.length; i++){
          //     if(d.scores[i].date - date > 0){
          //       return i > 0 ? 200 - d.scores[i-1].b * 2: 200 - d.scores[i].b * 2;
          //     }
          //   }
          //   return 200 - d.scores[d.scores.length - 1].b * 2;
          // })
          .attr('r', 5);


        //score updates
        scorePoints.transition()
          .attr('cx', function(d){
            var aSum = 0;
            var count = 0;
            for(var i = 0; i < d.scores.length; i++){
              if(date - d.scores[i].date <= 86400 * 1000 * 7 && date - d.scores[i].date >= 0){
                aSum += d.scores[i].a;
                count++;
              }
            }
            return count > 0 ? aSum / count * 2 : 100;
          })
          // .attr('cx', function(d){
          //   for(var i = 0; i < d.scores.length; i++){
          //     var 
          //     if(d.scores[i].date - date > 0){
          //       return i > 0 ? d.scores[i-1].a * 2: d.scores[i].a * 2;
          //     }
          //   }
          //   return d.scores[d.scores.length - 1].a * 2;
          // })
          .attr('cy', function(d){
            var bSum = 0;
            var count = 0;
            for(var i = 0; i < d.scores.length; i++){
              if(date - d.scores[i].date <= 86400 * 1000 * 7 && date - d.scores[i].date >= 0){
                bSum += d.scores[i].b;
                count++;
              }
            }
            return count > 0 ? 200 - bSum / count * 2 : 100;
          })
          // .attr('cy', function(d){
          //   for(var i = 0; i < d.scores.length; i++){
          //     if(d.scores[i].date - date > 0){
          //       return i > 0 ? 200 - d.scores[i-1].b * 2: 200 - d.scores[i].b * 2;
          //     }
          //   }
          //   return 200 - d.scores[d.scores.length - 1].b * 2;
          // })
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
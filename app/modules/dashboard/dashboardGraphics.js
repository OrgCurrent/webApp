'use strict';

angular.module('dashboardGraphics', [])

  .factory('mainChart', ['$window', 'fisheyeChart', 'timeFormat', function($window, fisheyeChart, timeFormat){
    return {
      render: function(data, sizing, scope){

        var users = data[0];
        var scores = data[1];
        var averages = data[2];

        var smoothAverages = [];
        for(var i = 0; i < averages.length; i++){
          var avgNumber = Math.min(i+1, 7);
          var weekAverageX = 0;
          var weekAverageY = 0;
          for(var j = i - avgNumber + 1; j <= i; j++){
            weekAverageX += averages[j].x / avgNumber;
            weekAverageY += averages[j].y / avgNumber;
          }
          smoothAverages.push({
            x: weekAverageX,
            y: weekAverageY,
            date: averages[i].date
          });
        }

        console.log(smoothAverages);

        scope.snapshotDate = timeFormat.format(smoothAverages[0].date);

        // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
        var x = d3.time.scale().range([0, sizing.width]),
            y = d3.scale.linear().range([sizing.height, 0]),
            xAxis = d3.svg.axis().scale(x).ticks(6).tickSubdivide(true),
            yAxis = d3.svg.axis().scale(y).ticks(4).orient("right");

        // A line generator
        var lineA = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.x); });

        //B line generator
        var lineB = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.y); });

        // Compute the minimum and maximum date, and the maximum a/b.
        x.domain([smoothAverages[0].date, smoothAverages[smoothAverages.length - 1].date]);
        y.domain([0, 100]).nice();

        //clear html of .board before updating new SVG
        var svg = d3.select('.board').html('').append('svg').attr("id", "board")
            .attr("width", sizing.width + sizing.margin.left + sizing.margin.right)
            .attr("height", sizing.height + sizing.margin.top + sizing.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + sizing.margin.left + "," + sizing.margin.top + ")")
            .on("mousemove", function(){
              scope.mousePosition = d3.mouse(this);
              snapshotUpdate();
            })
            .on('click', function(){
              if(scope.showFisheye){
                d3.select('#fisheye')
                    .attr('class', 'fisheye-hide')
              }else{
                d3.select('#fisheye')
                    .attr('class', 'fisheye-show');
              }
              scope.showFisheye = !scope.showFisheye;
            });

        // Add the clip path.
        var clip = svg.append("clipPath")
            .attr("id", "clip")
          .append("rect")
            .attr("width", sizing.width)
            .attr("height", sizing.height);
            
        // Add 'background' for the fisheye scroll
        var background = svg.append('rect')
            .attr('width', sizing.width)
            .attr('height', sizing.height)
            .attr('fill', 'transparent');

        // Add the x-axis.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + sizing.height + ")")
            .call(xAxis);

        // Add the y-axis.
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + sizing.width + ",0)")
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

        // Add 'Company success' x-label
        svg.append("text")
            .attr('id', 'xText')
            .attr("x", scope.mousePosition[0] + 5)
            .attr("y", sizing.height * (100 - smoothAverages[0].x) / 100 - 10)
            .style("text-anchor", "start")
            .text('Company success: ' + smoothAverages[0].x.toFixed(1));

        // Add 'Self success' y-label
        svg.append("text")
            .attr('id', 'yText')
            .attr("x", scope.mousePosition[0] + 5)
            .attr("y", sizing.height * (100 - smoothAverages[0].y) / 100 - 10)
            .style("text-anchor", "start")
            .text('Self success: ' + smoothAverages[0].y.toFixed(1));

        var snapshotLine = svg.append("line")
            .attr("class", "snapshot-line")
            .attr("x1", scope.mousePosition[0])
            .attr("x2", scope.mousePosition[0])
            .attr("y1", 0)
            .attr("y1", sizing.height);

        fisheyeChart.render(smoothAverages[0].date, users, scope);

        var snapshotUpdate = function(){

          if(scope.mousePosition[0] < sizing.width){

            snapshotLine.data(scope.mousePosition)
                .attr("x1", scope.mousePosition[0])
                .attr("x2", scope.mousePosition[0]);

            var xRatio = scope.mousePosition[0] / sizing.width;
            //swift xPos left slightly to accommodate last date
            var xPos = (smoothAverages.length - 1) * xRatio + 0.2;
            var xIndex = Math.floor(xPos);
            var date = smoothAverages[xIndex].date;
            var dateStr = timeFormat.format(date);

            //xText tag
            svg.select('#xText')
                .attr('x', scope.mousePosition[0] + 5)
                .attr('y', function(d, i){
                  var lastHeight = sizing.height * (100 - smoothAverages[xIndex].x) / 100;
                  if(xIndex < smoothAverages.length - 1){
                    var nextHeight = sizing.height * (100 - smoothAverages[xIndex+1].x) / 100;
                    var displacement = xPos - xIndex;

                  //substract 10 to swift it upwards
                    return lastHeight + displacement * (nextHeight - lastHeight) - 10;
                  }else{
                    return lastHeight - 10;
                  }
                })
                .text('Company success: ' + smoothAverages[xIndex].x.toFixed(1));

            //yText tag
            svg.select('#yText')
                .attr('x', scope.mousePosition[0] + 5)
                .attr('y', function(d, i){
                  var lastHeight = sizing.height * (100 - smoothAverages[xIndex].y) / 100;
                  if(xIndex < smoothAverages.length - 1){
                    var nextHeight = sizing.height * (100 - smoothAverages[xIndex+1].y) / 100;
                    var displacement = xPos - xIndex;

                    //substract 10 to swift it upwards
                    return lastHeight + displacement * (nextHeight - lastHeight) - 10;
                  }else{
                    return lastHeight - 10;
                  }
                })
                .text('Self success: ' + smoothAverages[xIndex].y.toFixed(1));

            scope.$apply(function(){
              scope.snapshotDate = dateStr;
            });
            
            fisheyeChart.render(date, users, scope);
          }
        };

      }
    };
  }])

  .factory('fisheyeChart', ['timeFormat', function(timeFormat){
    return {
      render: function(date, users, scope){

        var fisheye = d3.select('#fisheye');
        if(fisheye[0][0] === null){
          fisheye = d3.select('.board').append('svg')
            .attr('id', 'fisheye')
            //hide on page load
            .attr('class', 'fisheye-hide')
            .attr('width', 200)
            .attr('height', 200);

          fisheye.append('text');
        }

        fisheye.select("text")
            .attr("x", 5)
            .attr("y", 15)
            .style("text-anchor", "start")
            .text(timeFormat.format(date));

        // fisheye.style('background-color', 'red');
        // to be refactored
        fisheye.style('left', Math.max(90, Math.min(scope.mousePosition[0], scope.sizing.width - 100)));

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
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return d.scores[i].x * 2;
              }
            }
          })
          .attr('cy', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return 200 - d.scores[i].y * 2;
              }
            }
          })
          .attr('r', 5);

        //score updates
        scorePoints.transition()
          .attr('cx', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return d.scores[i].x * 2;
              }
            }
          })
          .attr('cy', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return 200 - d.scores[i].y * 2;
              }
            }
          })
          .attr('fill', function(d){
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0 && i < d.scores.length - 1){
                var x1 = d.scores[i].x
                var x0 = d.scores[i+1].x;
                var y1 = d.scores[i].y;
                var y0 = d.scores[i+1].y;

                var dx = x1 - x0;
                var dy = y1 - y0;
                var d = dx + dy;

                //redness and blueness of dot
                var redness = Math.max(0, Math.min(255, (100-d) * (255/200)));
                var blueness = Math.max(0, Math.min(255, (d+100) * (255/200)));

                return 'rgb(' + redness + ',0,' + blueness + ')';

                if(dx + dy){
                  return 'rgb(0,0,255)';
                }else{
                  return 'rgb(255,0,0)';
                }
              }
            }
          }) 
          .duration(100);

        scorePoints.on('mouseover', function(d){
          for(var i = d.scores.length - 1; i >= 0; i--){
            if(date - d.scores[i].date < 0 && i < d.scores.length - 1){
              var x1 = d.scores[i].x
              var y1 = d.scores[i].y;

              var i1 = Math.pow(x1 * x1 + y1 * y1, 0.5);
              console.log([x1, y1]);
              break;
            }
          }
        });

        //old score exit
        scorePoints.exit()
          .transition()
          .attr('opacity', 0)
          .duration(500)
          .remove();
      }
    };
  }])

  .factory('timeFormat', function(){
    return {
      parse: d3.time.format(""),
      format: d3.time.format("%d-%b-%y")
    };
  });

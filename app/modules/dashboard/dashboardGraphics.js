'use strict';

angular.module('dashboardGraphics', [])

  .factory('MainChart', ['$window', '$timeout', 'FisheyeChart', 'FisheyeLines', 'Datestamp', 'Scorestamp', 'SmoothAverages', 'PathMethods' ,'TimeFormat', function($window, $timeout, FisheyeChart, FisheyeLines, Datestamp, Scorestamp, SmoothAverages, PathMethods, TimeFormat){

    return {

      render: function(data, sizing, options){
        var that = this;

        //separate data
        var users = data[0];
        var scores = data[1];
        var averages = data[2];

        //create smoothAverages array for line chart
        var smoothAverages = SmoothAverages(averages, options);
        options.snapshotDate = TimeFormat.format(smoothAverages[0].date);

        // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
        var x = d3.time.scale().range([0, sizing.width]),
            y = d3.scale.linear().range([sizing.height, 0]),
            xAxis = d3.svg.axis().scale(x).ticks(4).tickFormat(d3.time.format("%d-%b-%y")),
            yAxis = d3.svg.axis().scale(y).ticks(6).orient("right");

        var volumeX = d3.scale.ordinal().rangeBands([0, sizing.width], 0.02),
            // halve the height of volume bars
            volumeY = d3.scale.linear().range([sizing.height, sizing.height / 2]);

        //find maximum volume for y-axis
        var maxVolume = 0;
        for(var i = 0; i < smoothAverages.length; i++){
          maxVolume = smoothAverages[i].count > maxVolume ? smoothAverages[i].count : maxVolume;
        }

        volumeX.domain(smoothAverages.map(function(d){
          return d.date;
        }));
        volumeY.domain([0, maxVolume]).nice();

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
        y.domain([0, 10]).nice();

        //clear html of .board-wrapper before updating new SVG
        var svg = d3.select('.board-wrapper').html('').append('svg').attr("id", "board")
            .attr("width", sizing.width + sizing.margin.left + sizing.margin.right)
            .attr("height", sizing.height + sizing.margin.top + sizing.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + sizing.margin.left + "," + sizing.margin.top + ")")
            .on("mousemove", function(){
              var mousePos = d3.mouse(this);
              if(mousePos[0] >= 0 && mousePos[0] <= sizing.width
                && mousePos[1] >= 0 && mousePos[1] <= sizing.height){
                options.mousePos = d3.mouse(this);                
                that.updateSnapshot(users, smoothAverages, sizing, options);
              }
            })
            .on('touchstart', function(){
              var mousePos = d3.mouse(this);
              if(mousePos[0] >= 0 && mousePos[0] <= sizing.width
                && mousePos[1] >= 0 && mousePos[1] <= sizing.height){
                //0 is the identifier
                options.mousePos = d3.mouse(this, 0);                
                that.updateSnapshot(users, smoothAverages, sizing, options);
              }
            })
            .on('touchmove', function(){
              var mousePos = d3.mouse(this);
              if(mousePos[0] >= 0 && mousePos[0] <= sizing.width
                && mousePos[1] >= 0 && mousePos[1] <= sizing.height){
                //0 is the identifier
                options.mousePos = d3.mouse(this, 0);                
                that.updateSnapshot(users, smoothAverages, sizing, options);
              }
            });
            // .on('click', function(){
            //   options.showFisheye = !options.showFisheye;
            //   FisheyeChart.updateDisplay(options);
            // });

        //show or hide fisheye display
        FisheyeChart.updateDisplay(options);

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

        // Add the x, y axes.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + sizing.height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + sizing.width + ",0)")
            .call(yAxis);

        var snapshotLine = svg.append("line")
            .attr("class", "snapshot-line")
            .attr("x1", options.mousePos[0])
            .attr("x2", options.mousePos[0])
            .attr("y1", sizing.height);

        var volumeTooltip = svg.append('text')
        .attr('class', 'volume-tooltip')
        .attr('font-size', '1.5em')
        .style('opacity', 0);

        var showVolumeTooltip = function(d){
          volumeTooltip
            .transition()
            .attr("x", function() {
              return volumeX(d.date);
            })
            .attr("y", function(){
              //fixed relative height
              return sizing.height * 0.8;
            })
            .text(d.count + ' votes')
            .style('opacity', 1)
            .duration(100);
        };
        var hideVolumeTooltip = function(d){
          volumeTooltip
            .transition()
            .style('opacity', 0)
            .duration(200);
        };

        var volumeBars = svg.selectAll(".volume-bar")
            .data(smoothAverages)
          .enter().append("rect")
            .attr("class", "volume-bar")
            .style('opacity', 0.3)
            .attr("x", function(d, i) {
              return volumeX(d.date);
            })
            .attr("width", volumeX.rangeBand())
            .attr("y", function(d, i){
              return volumeY(d.count);
            })
            .attr("height", function(d, i) {
              return sizing.height - volumeY(d.count);
            })
            .on('mouseenter', function(d){
              showVolumeTooltip(d);                
            })
            .on('mouseleave', function(d){
              hideVolumeTooltip(d);
            });
        // Add the lineX path.
        var lineX = svg.append("path")
            .attr("class", "line")
            .attr("id", "lineA")
            .attr("clip-path", "url(#clip)")
            .attr("d", lineA(smoothAverages));

        // Add the lineY path.
        var lineY = svg.append("path")
            .attr("class", "line")
            .attr("id", "lineB")
            .attr("clip-path", "url(#clip)")
            .attr("d", lineB(smoothAverages));

        //set height of snapshotLine
        snapshotLine
          .attr("y2", function(){
            var h1 = PathMethods.getYFromX(d3.select('#lineA'), options.mousePos[0]);
            var h2 = PathMethods.getYFromX(d3.select('#lineB'), options.mousePos[0]);
            var height = Math.min(h1, h2);
            return height;
          });

        Datestamp.render(smoothAverages[0].date, options.dateRange, smoothAverages);
        Scorestamp.render(smoothAverages[0].x.toFixed(1), smoothAverages[0].y.toFixed(1), sizing);
        // if(options.displayMode === 'fisheye'){
        if(options.showFisheye){
          FisheyeChart.render(smoothAverages[0].date, users, smoothAverages, sizing, options);
        }

      },

      updateSnapshot: function(users, smoothAverages, sizing, options){
        if(options.mousePos[0] < sizing.width){

          var xRatio = options.mousePos[0] / sizing.width;
          //swift xPos left slightly to accommodate last date
          var xPos = (smoothAverages.length - 1) * xRatio + 0.2;
          //hack
          var xIndex = Math.floor(xPos);
          var date = smoothAverages[xIndex].date;
          var dateStr = TimeFormat.format(date);

          options.snapshotDate = dateStr;

          var h1 = PathMethods.getYFromX(d3.select('#lineA'), options.mousePos[0]);
          var h2 = PathMethods.getYFromX(d3.select('#lineB'), options.mousePos[0]);
          var height = Math.min(h1, h2);

          d3.select('.snapshot-line').data(options.mousePos)
            .attr("x1", options.mousePos[0])
            .attr("x2", options.mousePos[0])
            .attr("y1", sizing.height)
            .attr("y2", height);

          Datestamp.render(date, options.dateRange, smoothAverages);
          Scorestamp.render(smoothAverages[xIndex].x.toFixed(1), smoothAverages[xIndex].y.toFixed(1), sizing);

          // if(options.displayMode === 'fisheye'){
          if(options.showFisheye){
            d3.selectAll('.fisheye-line')
              .attr('x1', options.mousePos[0] + sizing.margin.left)
              .attr('y1', height + sizing.margin.top);            
            FisheyeChart.render(date, users, smoothAverages, sizing, options);
          }
        }
      },

      updateVolume: function(options){
        d3.selectAll('.volume-bar')
          .attr('display', function(){
            return options.showVolume ? 'static' : 'none'
          });
      }

    };
  }])

  .factory('FisheyeChart', ['TimeFormat', function(TimeFormat){
    return {
      render: function(date, users, smoothAverages, sizing, options){

        var fisheyeSizing = {
          width: 150,
          height: 150
        };

        var fisheye = d3.select('.fisheye');
        if(fisheye[0][0] === null){
          fisheye = d3.select('.board-wrapper').append('svg')
            .attr('display', function(){
              return options.showFisheye ? 'static' : 'none';
            })
            .attr('class', 'fisheye')
            .attr('width', fisheyeSizing.width)
            .attr('height', fisheyeSizing.height);
            //fisheye labels
            fisheye.append('text')
              .attr('class', 'fisheye-label')
              .text('10')
              .style('text-anchor', 'end')
              .attr('x', fisheyeSizing.width - 2)
              .attr('y', fisheyeSizing.height - 2);
            fisheye.append('text')
              .attr('class', 'fisheye-label')
              .text('0')
              .style('text-anchor', 'start')
              .attr('x', 2)
              .attr('y', fisheyeSizing.height - 2);
            fisheye.append('text')
              .attr('class', 'fisheye-label')
              .text('10')
              .style('text-anchor', 'start')
              .attr('x', 2)
              .attr('y', 10);

            //fisheye legends
            fisheye.append('text')
              .attr('class', 'fisheye-legend')
              .text('Company success')
              .style('text-anchor', 'middle')
              .attr('x', fisheyeSizing.width / 2)
              .attr('y', fisheyeSizing.height - 2);
            fisheye.append('text')
              .attr('class', 'fisheye-legend')
              .text('Personal success')
              .style('text-anchor', 'middle')
              .attr('transform', 'rotate(270, 8, 75)')
              .attr('x', 8)
              .attr('y', fisheyeSizing.height / 2);
        }

        this.updateDisplay(options);

        //Add the 3 fisheye-box lines if there are not there
        if(!d3.select('.fisheye-lines')[0][0]){
          var fisheyeLines = d3.select('#board')
            .append("g")
              .attr('class', 'fisheye-lines');
          fisheyeLines.selectAll('.fisheye-line')
          //hard-coded positions of 3 corners of fisheye chart
            .data([[8, 220], [158, 220], [158, 70]])
            .enter()
              .append('line')
              .attr("class", "fisheye-line")
              .attr('x1', options.mousePos[0] + sizing.margin.left)
              .attr('y1', Math.min(
                sizing.height * (10 - smoothAverages[0].x) / 10,
                sizing.height * (10 - smoothAverages[0].y) / 10
              ) + sizing.margin.top)
              .attr('x2', function(d, i){return d[0];})
              .attr('y2', function(d, i){return d[1];});          
        }

        var scorePoints = fisheye.selectAll('.fisheye-dot')
          .data(users);
        //new score entry
        scorePoints.enter()
          .append('circle')
          .attr('class', 'fisheye-dot fisheye-dot-show')
          .attr('fill', function(d){return 'rgb(245,245,245)'})
          .attr('cx', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return d.scores[i].x * fisheyeSizing.width / 10;
              }
            }
          })
          .attr('cy', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return fisheyeSizing.height - d.scores[i].y * fisheyeSizing.height / 10;
              }
            }
          })
          .attr('r', 3)
          .attr('opacity', 0.75);

        //score updates
        scorePoints.transition()
          .attr('cx', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return d.scores[i].x * fisheyeSizing.width / 10;
              }
            }
            return d.scores[d.scores.length - 1].x * fisheyeSizing.width / 10;
          })
          .attr('cy', function(d){
            //instant score
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0){
                //same date but later
                return fisheyeSizing.height - d.scores[i].y * fisheyeSizing.height / 10;
              }
            }
            return fisheyeSizing.height - d.scores[d.scores.length - 1].y * fisheyeSizing.height / 10;
          })
          .attr('fill', function(d){
            for(var i = d.scores.length - 1; i >= 0; i--){
              if(date - d.scores[i].date < 0 && i < d.scores.length - 1){
                var dx = d.scores[i].x - d.scores[i+1].x;
                var dy = d.scores[i].y - d.scores[i+1].y;
                var diff = dx + dy;

                //sensitive setting
                var blueness = Math.max(0, Math.min(255, (diff+1.5) * (255/3)));

                return 'rgb(' + (255 - blueness) + ',0,' + blueness + ')';
              }
            }
          }) 
          .duration(100);

        //old score exit
        scorePoints.exit()
          .transition()
          .attr('opacity', 0)
          .duration(300)
          .remove();
      },

      updateDisplay: function(options){
        d3.selectAll('.fisheye, .fisheye-dot, .fisheye-line')
          .attr('display', function(){
            return options.showFisheye ? 'static' : 'none'
          });
      },
    };
  }])

  .factory('FisheyeLines', [function(){

  }])

  .factory('Datestamp', ['TimeFormat', function(TimeFormat){
    return {
      render: function(date, range, smoothAverages){
        //create datestamp in board if it is not there yet
        if(!d3.select('.board-wrapper').select('.datestamp')[0][0]){
          d3.select('.board-wrapper').append('text')
            .attr('class', 'datestamp');          
        }
        d3.select('.board-wrapper .datestamp')
          .attr("x", 5)
          .attr("y", 15)
          .style("text-anchor", "start")
          .text(function(){
            if(range <= 31){
              return TimeFormat.format(date);
            }else{
              var lastDate = new Date(Date.parse(date) - 86400000 * 6);
              return TimeFormat.format(lastDate) + ' - ' + TimeFormat.format(date) + ': '
              ;
            }
          });
      }
    };
  }])

  .factory('Scorestamp', [function(){
    return {
      render: function(x, y, sizing){

        if(!d3.select('.xText')[0][0]){
          //legend label for x
          d3.select('#board').append('rect')
            .attr('fill', 'rgb(8,108,225)')
            .attr('x', 5)
            .attr('y', 25)
            .attr('width', 10)
            .attr('height', 10);

          d3.select('#board').append("text")
            .attr('text-anchor', 'start')
            .attr('class', 'xText')
            .attr('x', 25)
            .attr('y', 35)
            .text('Outlook on success of company in coming 12 months (1-10): ' + x);          
        }else{
        d3.select('.xText').text('Outlook on success of company in coming 12 months (1-10): ' + x);          
        }
        if(!d3.select('.yText')[0][0]){
          //legend label for y
          d3.select('#board').append('rect')
            .attr('fill', 'rgb(255,121,0)')
            .attr('x', 5)
            .attr('y', 45)
            .attr('width', 10)
            .attr('height', 10);

          d3.select('#board').append("text")
            .attr('text-anchor', 'start')
            .attr('class', 'yText')
            .attr('x', 25)
            .attr('y', 55)
            .text('Outlook on personal success at company in coming 12 months (1-10): ' + y);          
        }else{
          d3.select('.yText').text('Outlook on personal success at company in coming 12 months (1-10): ' + y);          
        }
      }
    }
  }])

  .factory('SmoothAverages', function(){

    return function(averages, options){
      var range = options.dateRange;
      var firstDate = new Date() - range * 86400000;
      var filteredAverages = averages.filter(function(average){
        return Date.parse(average.date) >= firstDate;
      });

      var smoothAverages = [];
      if(range < 31){
        //1 month; show every day
        return filteredAverages;
      }else{
        for(var i = (range - 1) % 7; i < filteredAverages.length; i += 7){
          var avgNumber = Math.min(i+1, 7);
          var weekAverageX = 0;
          var weekAverageY = 0;
          var count = 0;
          for(var j = i; j > i - avgNumber; j--){
            weekAverageX += filteredAverages[j].x / avgNumber;
            weekAverageY += filteredAverages[j].y / avgNumber;
            count += filteredAverages[j].count;
          }
          smoothAverages.push({
            x: weekAverageX,
            y: weekAverageY,
            date: averages[i].date,
            count: count
          });
        }
      }
      return smoothAverages;
    };
  })

  .factory('PathMethods', function(){
    return {
      getYFromX: function(el, x){
        var path = el[0][0];
        var finalX = 0;
        var point;
        var len = 0;

        //binary search
        var x0 = 0;
        var x1 = 1;

        var steps = 0;
        var totalLength = path.getTotalLength();

        point = path.getPointAtLength(len);

        while(Math.abs(finalX - x) > 1){
          len = (x0 + x1) / 2 * totalLength;
          point = path.getPointAtLength(len);
          finalX = point.x;
          if(finalX > x){
            x1 = x1 - (x1 - x0) / 2;
          }else{
            x0 = x0 + (x1 - x0) / 2;
          }
          steps++;
        }
        return point.y;
      }
    };
  })

  .factory('TimeFormat', function(){
    return {
      parse: d3.time.format(""),
      format: d3.time.format("%d-%b-%y")
    };
  });

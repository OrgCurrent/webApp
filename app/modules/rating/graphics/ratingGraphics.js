'use strict';

angular.module('ratingGraphics', [])
  .factory('scoresGraph', ['$window', 'graphApiHelper', '$timeout',
    function($window, graphApiHelper, $timeout){
    return {
      initialize: function(rootScope, scope, sizing){

        // options for graph size
        var pageWidth = parseInt(d3.select('.ratingBoard').style('width'));
        var pageHeight = $window.innerHeight;
        var dotSize = Math.sqrt(pageWidth*pageWidth + pageHeight*pageHeight)/100;
        var margin = {top: pageHeight/15, right: pageWidth/10, bottom: pageHeight/10, left: pageWidth/8};
        var height = pageHeight - margin.top - margin.bottom - 150;
        var width =   pageWidth - margin.left - margin.right - 30;

        // options for graph behaviour
        var defaultPostHistory = 7; // will show last posts days by default
        var postOnClickDuration = 500 ; // duration of click to submit rating
        var rewardGoAway = 4500; //duration until the reward alert goes away

        var clickTimer = 0;
        // set the height and the width to be equal (to the smaller of the two)
        var graphLength = Math.min(sizing.height, sizing.width);

        scope.scored = rootScope.currentUser.scoredToday || false;

        /* 
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */

        // setup x 
        var xValue = function(d){ return d.x;}, // data -> value
            xScale = d3.scale.linear().range([0, graphLength]), // value -> display
            xMap = function(d){ return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient('bottom');

        // setup y
        var yValue = function(d){ return d.y;}, // data -> value
            yScale = d3.scale.linear().range([graphLength, 0]), // value -> display
            yMap = function(d){ return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient('left');

        // add the graph canvas to the body of the webpage
        var svg = d3.select('.ratingBoard').append('svg')
            .attr('class', 'ratingsvg')
            // .attr('width', width + margin.left + margin.right)
            .attr('width', graphLength + sizing.margin.left + sizing.margin.right)
            // .attr('height', height + margin.top + margin.bottom)
            .attr('height', graphLength + sizing.margin.top + sizing.margin.bottom)
            .on('mousedown', function(){
              // handles a user click to post a rating, if user hasn't scored today
              if(!scope.scored){
                var mousePos = d3.mouse(this);
                // if the page is wider, graph is wider, - detect clicks accurately irrespective of rescaling

                var yaxis = document.getElementsByClassName('y-rating-axis')[0].getBoundingClientRect();
                var yaxisPosition = yaxis.left + yaxis.width / 2 
                - document.getElementsByClassName('ratingsvg')[0].getBoundingClientRect().left;

                var xaxis = document.getElementsByClassName('x-rating-axis')[0].getBoundingClientRect();
                var xaxisPosition = xaxis.top + xaxis.height/2; 
                var topBoard = document.getElementsByClassName('dashboard-title')[0].getBoundingClientRect().bottom;

                var newX = ((mousePos[0] - yaxisPosition - 4)*10)/graphLength;
                var newY = ((xaxisPosition - topBoard - mousePos[1])*10)/graphLength;

                clickTimer = Date.now();
                // only acceps a click if it is within the bounds of the graph area
                if(newX > -0.5 && newX < 10.5 && newY > -0.5 && newY < 10.5){
                  scope.clickPosition =[{x: newX, y: newY}];
                  updateUserDots(scope.clickPosition, true);
                }      
              }
            })
           .on('mouseup', function( ){
            if( Date.now() - clickTimer > postOnClickDuration){
              scope.submitScore();
            } 
            clickTimer = 0;
           })
           .append('g')
            .attr('transform', 'translate(' + sizing.margin.left + ',' + sizing.margin.top + ')');

        xScale.domain([0, 10]);
        yScale.domain([0, 10]);

        /***/

        xAxis.ticks(Math.max(graphLength/50, 2));
        yAxis.ticks(Math.max(graphLength/50, 2));

        xAxis.tickSize(1,1);
        yAxis.tickSize(1,1);

        var tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        // x-axis
        svg.append('g')
            .attr('class', 'x-rating-axis')
            .attr('transform', 'translate(0,' + graphLength + ')')
            .call(xAxis)
          .append('text')
            .attr('class', 'label')
            .attr('x', graphLength)
            .attr('y', -6)
            .style('text-anchor', 'end')
            .text('Company success');

        // y-axis
        svg.append('g')
            .attr('class', 'y-rating-axis')
            .call(yAxis)
          .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Personal success');

        // utility function for calculating post age
        var dayDifference = function(date){
          return Math.floor((new Date() - new Date(date)) /  (86400 * 1000));
        };

        // utility function for dot tooltip formatting
        var postLabel = function(d){
            var daysAgo = dayDifference(d.date);
            var text = daysAgo ? daysAgo + ' days ago' : 'today';
            text = daysAgo === 1 ? 'yesterday' : text;

            tooltip.transition()
              .duration(200)
              .style('opacity', .9);

            tooltip.html('Company Success: ' + Math.floor(xValue(d)*10)/10 + '</span>'
              + '<br/> Personal Success: ' + Math.floor(yValue(d)*10)/10 + '</span>'
              + '<br/> Posted ' + text)
              .style('left', (d3.event.pageX + 15) + 'px')
              .style('top', (d3.event.pageY - 40) + 'px')
              .style('border-radius', '2px');
        };

        var loadAllDots = function(data){
          // colleague post UI / display options
          var strokeWidth = 2;
          var delay = 50;
          var duration = 200;

          // draw dots
          svg.selectAll('.colleagueScores')
              .data(data)
            .enter().append('circle')
              .attr('class', 'colleagueScores')
              .attr('r', 0)
              .attr('cx', xMap)
              .attr('cy', yMap)
            .on('mouseover', function(d){
              postLabel(d);
            })
            .on('mouseout', function(d){
              tooltip.transition()
                .duration(500)
                .style('opacity', 0);
            })
            .transition().delay(function(d, i){ return delay * i; }).duration(duration)
              .attr('r', dotSize*0.625)
              .attr('stroke-width', strokeWidth)
              .each('end', function(){
                // have ripple around data point
                ripple([this.cx.animVal.value, this.cy.animVal.value]);
              })
              .attr('opacity', function(d){ 
                //  makes the dots / posts more transparent the older they are
                var date = d.date;
                var postAgeDays = date ? dayDifference(date) : 0;  
                return  (defaultPostHistory  - postAgeDays) / defaultPostHistory ;
              });
        };

        // if the today argument is set to true, mark the post as posted today
        var updateUserDots = function(data, today){
          // user post UI / display options
          var initR = 40;
          var finalR = 10;
          var thickness = 6;

          var userDots = today ? svg.selectAll('.today').data(data) 
                               : svg.selectAll('.notToday').data(data);

          userDots
            .enter().append('circle')
              .attr('class', function(d){
                var date = d.date;
                var today = !dayDifference(date) ? true : false;
                return today ? 'userScore today' : 'userScore notToday';
              })
            .on('mouseover', function(d){
              postLabel(d);
            })
            .on('mouseout', function(d){
                tooltip.transition()
                   .duration(500)
                   .style('opacity', 0);
            })
            .transition().duration(1000).ease('linear')
              .attr('r', dotSize*2)
              .attr('cx', xMap)
              .attr('cy', yMap)
              .attr({'stroke-width' : thickness, 'stroke-opacity': 0.5});

          userDots
            .attr('r', dotSize*2)
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('opacity', function(d){ 
              // this makes the dots / posts more transparent the older they are
              var date = d.date;
              var postAgeDays = date ? dayDifference(date) : 0;
              return (defaultPostHistory  - postAgeDays) / defaultPostHistory ;
            });
        };

        // if page hasn't initialized and the player has already scored today
        // retrieve the company scores immediately and display them
        if(scope.scored && !scope.initialized){
          graphApiHelper.getCompanyScores()
            .success(function(data){
              var scores = [];
              for(var i = 0; i < data.length; i++){
                if(data[i].score){
                  scores.push({x: data[i].score.x, y: data[i].score.y,  date: data[i].score.date});
                }
              }
              // store colleague scores on the scope, so they can be 
              // redrawn when the page is resized (instead of another GET)
              scope.colleagueScores = scores;
              loadAllDots(scores);
              //get user last score from scope.currentUser
              var userScore = scope.currentUser.scores[0];
              scope.clickPosition = [{x: userScore.x, y: userScore.y}];
              updateUserDots(scope.clickPosition, true);
            });
        } else if(scope.scored){
          // if page has loaded and user has posted a score load / render
          // both colleague and user scores (**this is run when the page is resized**)
          updateUserDots(scope.clickPosition, true);
          loadAllDots(scope.colleagueScores);
        } else {
          // if the page has loaded, but the user hasn't posted
          // update the user dot prior to submission 
          updateUserDots(scope.clickPosition, true);
        }

        var ripple = function(position){
          // constants for the ripple
          var initR = 10;
          var finalR = 40;
          var thickness = 3;
          var duration = 500;

          var circle = svg.append('circle')
            .attr({
              'cx': position[0],
              'cy': position[1],
              'r': (initR - (thickness / 2)),
              'class': 'colleague-ripples',
            })
            .style('stroke-width', thickness)
          .transition().duration(duration).ease('quad-in')
            .attr('r', finalR)
            .style('stroke-opacity', 0)
            .each('end', function (){
              d3.select(this).remove();
            });
        };  

        scope.submitScore = function(){
          var score = scope.clickPosition[0];
          graphApiHelper.submitUserScore(score)
            .success(function(data){

              //load All Dots
              // after a successful POST mark set the scope scored property to true
              scope.scored = true;
              rootScope.currentUser.scoredToday = true;
              rootScope.currentUser.rewardPoints = data.rewardPoints;

              scope.currentUser.earnedPoints = data.earnedPoints || undefined;
              $timeout(function(){scope.currentUser.earnedPoints = undefined}, rewardGoAway);

              graphApiHelper.getCompanyScores()
                .success(function(data){
                  var scores = [];
                  for(var i = 0; i < data.length; i++){
                  // only display colleague score if there is a valid score property
                  // and the score is not equal to the user score
                    if(data[i].score && data[i].score.x !== score.x && data[i].score.y !== score.y){
                      scores.push({x: data[i].score.x, y: data[i].score.y, date: data[i].score.date});
                    }
                  }
                  // store colleague scores on the scope, so they can be 
                  // redrawn when the page is resized (instead of another GET)
                  scope.colleagueScores = scores;

                  loadAllDots(scores);

                  // scope.clickPosition.push(scope.clickPosition[0]);

                  updateUserDots(scope.clickPosition, true);
                });
            });
        };

        scope.initialized = true;

        scope.displayHistory = function(){
          d3.selectAll('.notToday').remove();

          if(!scope.displayPostHistory){
            updateUserDots(scope.currentUser.scores.slice(0, defaultPostHistory));
            scope.displayPostHistory = true;
          } else {
            scope.displayPostHistory = false;
          }
        }
      }
    }
  }])
  .factory('graphApiHelper', ['$rootScope', '$http', function($rootScope, $http){

    return {
      submitUserScore: function(score){
        return $http({
          method: 'POST',
          url: '/api/users/' + $rootScope.currentUser.id + '/scores',
          data: {
            x: score.x,
            y: score.y
          }
        });
      },
      getCompanyScores: function(){
        return $http({
          method: 'GET',
          url: 'api/companies/' + $rootScope.currentUser.company + '/scores/mostrecent'
        });
      }
    };
  }])
  .directive('circleKey', function(){
  var link = function(scope, element, attr){
    var outerRadius = 1.5;
    var innerRadius = 3;
    var radius = 5;

    var svg = d3.select(element[0])
      .append('svg')
      .attr({
        'height': 10,
        'width': 10
      })
      .append('circle')
      .attr('cx', 5)
      .attr('cy', 5)
      .attr('r', innerRadius)
      .style('stroke-width', outerRadius);

    scope.user === 'true' ? svg.attr('class', 'userScore') 
                          : svg.attr('class', 'colleagueScores');
  };

  return {
    restrict: 'E',
    link: link,
    scope: {user: '@'}
  };
});

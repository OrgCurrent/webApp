"use strict";

angular.module('ratingGraphics', [])
  .factory('scoresGraph', ['graphApiHelper', function(graphApiHelper){
    return {
      initialize: function(scope){
        var pageWidth = parseInt(d3.select(".board").style("width"));
        var pageHeight = window.innerHeight;
        var dotSize = Math.sqrt(pageWidth*pageWidth + pageHeight*pageHeight)/100;

        // console.log(pageWidth, pageHeight);

        var margin = {top: pageHeight/10, right: pageWidth/15, bottom: pageHeight/5, left: pageWidth/15},
            width = pageWidth/1.75 - margin.left - margin.right,
            height = pageHeight - 150 - margin.top - margin.bottom;

        /* 
         * value accessor - returns the value to encode for a given data object.
         * scale - maps value to a visual display encoding, such as a pixel position.
         * map function - maps from data value to display value
         * axis - sets up axis
         */ 

        // setup x 
        var xValue = function(d) { return d.x;}, // data -> value
            xScale = d3.scale.linear().range([0, width]), // value -> display
            xMap = function(d) { return xScale(xValue(d));}, // data -> display
            xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        // setup y
        var yValue = function(d) { return d.y;}, // data -> value
            yScale = d3.scale.linear().range([height, 0]), // value -> display
            yMap = function(d) { return yScale(yValue(d));}, // data -> display
            yAxis = d3.svg.axis().scale(yScale).orient("left");

        // setup fill color
        // var cValue = function(d) { return d.Manufacturer;},
        //     color = d3.scale.category10();

        // add the graph canvas to the body of the webpage
        // var ratingSvg = d3.select(".board").append("svg");

        var svg = d3.select(".board").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .on("mousedown", function(){
              if(scope.allowedToVote){
                var mousePos = d3.mouse(this);
                // if(mousePos[0] >= 50 && mousePos[0] <= 450 && mousePos[1] >= 50 && mousePos[1] <= 450){
                  console.log('xmousePos');
                  console.log(mousePos[0]);
                  // if the page is wider, graph is wider 
                  var yaxis = document.getElementsByClassName("y axis")[0].getBoundingClientRect();
                  var yaxisPosition = yaxis.left + yaxis.width / 2;

                  var xaxis = document.getElementsByClassName("x axis")[0].getBoundingClientRect();
                  var xaxisPosition = xaxis.left + xaxis.width / 2;

                  console.log(yaxisPosition); //33

                  var newX = ((mousePos[0] - yaxisPosition)*100)/width;
                  var newY = (pageHeight - 150 - margin.top - mousePos[1]) / 4;
                  console.log('newx');
                  console.log(newX); // newY);
                  // console.log('pageWidth Height');
                  // console.log(pageWidth, pageHeight);
                  scope.userData =[{x: newX, y: newY}];                
                  updateUserDots();
                // }
              }
            })
           .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // add the tooltip area to the webpage
        var tooltip = d3.select(".board").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // load data

        // d3.csv("cereal.csv", function(error, data) {

          // change string (from CSV) into number format
        //   data.forEach(function(d) {
        //     d.Calories = +d.Calories;
        //     d["Protein (g)"] = +d["Protein (g)"];
        // //    console.log(d);
        //   });

          // don't want dots overlapping axis, so add in buffer to data domain
          // xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
          // yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);


          xScale.domain([0, 100]);
          yScale.domain([0, 100]);

          // x-axis
          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .append("text")
              .attr("class", "label")
              .attr("x", width)
              .attr("y", -6)
              .style("text-anchor", "end")
              .text("Company success");

          // y-axis
          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("class", "label")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Personal success");

          var loadAllDots = function(data){
            // draw dots

            svg.selectAll(".dot")
                .data(data)
              .enter().append("circle")
                .attr("class", "dot")
                .attr("r", dotSize)
                .attr("cx", xMap)
                .attr("cy", yMap)
                // .style("fill", function(d) { return color(cValue(d));}) 
                .style("fill", "red")
                .attr('opacity', 0)
                .transition()
                .duration(1000)
                .attr('opacity', 1);
                // .on("mouseover", function(d) {
                //     tooltip.transition()
                //          .duration(200)
                //          .style("opacity", .9);
                //     tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
                //     + ", " + yValue(d) + ")")
                //          .style("left", (d3.event.pageX + 5) + "px")
                //          .style("top", (d3.event.pageY - 28) + "px");
                // })
                // .on("mouseout", function(d) {
                //     tooltip.transition()
                //          .duration(500)
                //          .style("opacity", 0);
                // });            
          };

          var updateUserDots = function(data){
            var userDots = svg.selectAll(".user-dot")
                .data(scope.userData);
                // .data(data);
            // userDots.select('circle').remove();

            userDots
              .enter().append("circle")
                .attr("class", "user-dot")
                .attr("r", dotSize*2)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "blue");

            userDots
                .attr("class", "user-dot")
                .attr("r", dotSize*2)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", "blue");
          };

          //testing click rating functionality

          // var board = d3.select('.board').select('svg');
          // board.on("mousedown", function(){
          //   if(scope.allowedToVote){
          //     var mousePos = d3.mouse(this);
          //     // if(mousePos[0] >= 50 && mousePos[0] <= 450 && mousePos[1] >= 50 && mousePos[1] <= 450){
          //       console.log(mousePos);
          //       var newX = (mousePos[0] - margin.left) / 4;
          //       var newY = (pageHeight - 150 - margin.top - mousePos[1]) / 4;
          //       console.log(newX, newY);
          //       scope.userData =[{x: newX, y: newY}];                
          //       updateUserDots();
          //     // }
          //   }
          // });

          // if page hasn't initialized and the player has already scored today
          // retrieve the company scores immediately and display them
          if(scope.scored && !scope.initialized){
            graphApiHelper.getCompanyScores()
              .success(function(data){
                var scores = [];
                for(var i = 0; i < data.length; i++){
                  if(data[i].score){
                    scores.push({x: data[i].score.x, y: data[i].score.y});
                  }
                }
                // store colleague scores on the scope, so they can be 
                // redrawn when the page is resized (instead of another GET)
                scope.colleagueScores = scores;
                loadAllDots(scores);
                //get user last score from scope.currentUser
                var userScore = scope.currentUser.scores[0];
                scope.userData = [{x: userScore.x, y: userScore.y}];
                updateUserDots();
              });
          } else if(scope.scored){
            // if page has loaded and user has posted a score load / render
            // both colleague and user scores
            updateUserDots();
            loadAllDots(scope.colleagueScores);
          } else {
            // if the page has loaded, but the user hasn't posted
            // update the user dot prior to submission 
            updateUserDots();
          }

          scope.submitScore = function(){
            // $http POST call
            var score = scope.userData;
            graphApiHelper.submitUserScore(score[0])
              .success(function(data){
                //load All Dots
                scope.allowedToVote = false;
                graphApiHelper.getCompanyScores()
                  .success(function(data){
                    var scores = [];
                    for(var i = 0; i < data.length; i++){
                      if(data[i].score){
                        scores.push({x: data[i].score.x, y: data[i].score.y});
                      }
                    }
                    // after a successful POST mark set the scope scored property to true
                    scope.scored = true;
                    // store colleague scores on the scope, so they can be 
                    // redrawn when the page is resized (instead of another GET)
                    scope.colleagueScores = scores;
                    loadAllDots(scores);
                    scope.userData.push(scope.userData[0]);
                    updateUserDots();
                  });
              });
          };

        scope.initialized = true;
          // draw legend
          // var legend = svg.selectAll(".legend")
          //     .data(color.domain())
          //   .enter().append("g")
          //     .attr("class", "legend")
          //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

          // // draw legend colored rectangles
          // legend.append("rect")
          //     .attr("x", width - 18)
          //     .attr("width", 18)
          //     .attr("height", 18)
          //     .style("fill", color);

          // // draw legend text
          // legend.append("text")
          //     .attr("x", width - 24)
          //     .attr("y", 9)
          //     .attr("dy", ".35em")
          //     .style("text-anchor", "end")
          //     .text(function(d) { return d;})
        // });
      }
    }
  }])
  .factory('ratingGraph', function(){

  })
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
        })
      }
    };
  }]);

angular.module('formatUsers', [])
  .factory('formatUsers', [function(){
    return function(newUsers){

      var parse = d3.time.format("%d-%b-%y").parse;
      var format = d3.time.format("%d-%b-%y");

      //generate random user data
      // var newUsers = [];
      // for(var i = 0; i < n; i++){
      //   newUsers.push(randomUser(s));
      // }

      var sortedScores = {};
      for(var i = 0; i < newUsers.length; i++){
        for(var j = 0; j < newUsers[i].scores.length; j++){
          var score = newUsers[i].scores[j];
          score.date = new Date(score.date);
          var dataStr = format(score.date);
          if(sortedScores[dataStr]){

            sortedScores[dataStr].push({
              x: score.x,
              y: score.y,
              user_id: newUsers[i]._id
            });
          }else{
            sortedScores[dataStr] = [{
              x: score.x,
              y: score.y,
              user_id: newUsers[i]._id
            }];
          }
        }
      }

      var averageScores = [];
      for(var date in sortedScores){
        var xSum = 0;
        var ySum = 0;
        var count = sortedScores[date].length;
        for(var i = 0; i < count; i++){
          xSum += sortedScores[date][i].x;
          ySum += sortedScores[date][i].y;
        }
        averageScores.push({
          date: parse(date),
          x: xSum / count,
          y: ySum / count
        });
      }

      averageScores.sort(function(obj1,obj2){
        return obj1.date - obj2.date;
      });

      return [newUsers, sortedScores, averageScores]; 
    };
  }]);
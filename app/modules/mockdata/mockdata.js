angular.module('mockData', [])

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
          x: Math.random() * 100,
          y: Math.random() * 100
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
  }])

  .factory('formatUsers', ['randomUser', function(randomUser){
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
          // console.log(score.datse);
          var dataStr = format(score.date);
          console.log(dataStr);
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

      console.log(sortedScores);

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

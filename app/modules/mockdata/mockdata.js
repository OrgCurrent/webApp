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

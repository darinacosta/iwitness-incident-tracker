var http = require("http"),
    fs = require('fs'),
    parseString = require('xml2js').parseString,
    url = "http://map.labucketbrigade.org/feed",
    file = "incidents.json",
    incidents = require('./incidents.json'),

download = function(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
},

writeToFile = function(content){
  fs.writeFile(file, content, function(e){
    if(e) {
      console.log(e);
    } else {
        console.log("The file was saved.");
    }
  })
},

jsonRecorded = function(entry){
  for (var i = 0; i < incidents.length; i++){
    if (incidents[i]['guid'][0] === entry['guid'][0]){
      console.log(incidents[i]['guid']  + ' is already recorded')
      return true;
    }
  }
  return false;
};

download(url, function(data) {
  //var json;
  if (data) {
    parseString(data, function (err, result) {
      var targetData = result['rss']['channel'][0]['item'];
      for (var i = 0; i < targetData.length; i++){
        if (jsonRecorded(targetData[i]) === false){
          console.log(incidents[i]['guid'] + ' was recorded');
          incidents.push[targetData[i]]
        }
      }
      var incidentString = JSON.stringify(incidents, undefined, 2);
      writeToFile(incidentString);
    });
  }
  else console.log("error");  
});

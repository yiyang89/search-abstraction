var https = require('https');

module.exports.imageSearch = function(searchTerm, offset, callback) {
  console.log(searchTerm);
  var searchPath = '/customsearch/v1?cx=016511999152160798286:75it7fymuks&key=AIzaSyB7fmTAYI3rfF2SyY5MYni8GPa0Hsqc814&alt=json&searchType=image&q=' + searchTerm;
  if (!offset) {
    searchPath = searchPath + "&start=" + offset;
  }

  console.log(searchPath);

  // // HTTP get code courtesy of http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
  var options = {'hostname':'www.googleapis.com', 'path': searchPath, 'port':443};
  var req = https.get(options, function(response) {
    var responseBody = [];
    response.on('data', function(chunk) {
      responseBody.push(chunk);
    });
    response.on('end', function() {
      // parse response into a json object
      var jsonResult = JSON.parse(Buffer.concat(responseBody));
      var returnArr = [];
      jsonResult.items.forEach(function (oneResult) {
        var insertItem = {};
        insertItem.url = oneResult.link;
        insertItem.snippet = oneResult.snippet;
        insertItem.thumbnail = oneResult.image.thumbnailLink;
        insertItem.context = oneResult.image.contextLink;
        returnArr.push(insertItem);
      });
      callback(returnArr);
    });
  });
  req.on('error', function(e) {
    console.log("Encountered error: " + e);
  });
};

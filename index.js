var express = require('express');
var app = express();
var mongowrap = require('./scripts/mongowrap.js');
var googlewrap = require('./scripts/googlewrap.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/api/imagesearch/:SEARCHTERM', function(request, response) {
  console.log(request.params.SEARCHTERM);
  console.log(request.query);
  // Process the searchterm into mongodb
  mongowrap.addTerm(request.params.SEARCHTERM);
  // Process the search request
  googlewrap.imageSearch(request.params.SEARCHTERM, request.query.offset, function (result) {
    response.send(result);
  });
});

app.get('/api/latest/imagesearch/', function(request, response) {
  // Retrieve the original url from the db and send the page to the user.
  mongowrap.getHistory(function(history) {
    response.send(history);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

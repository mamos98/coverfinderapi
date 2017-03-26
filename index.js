var express = require('express'),
    rp      = require('request-promise'),
    cors    = require('cors'),
    app     = express();

// Set Main Configurations
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Set CORS
var whitelist = ['http://localhost:4200/', 'http://masoudmirzei.ir/'];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  }
};

app.use(cors(corsOptions));

// Set View Configurations
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');


// Set Routes
// Show Landing Page
app.get('/', function (request, response) {
  response.render('main/landing');
});

app.get('/api', function (request, response) {
  response.json({
    message: 'This is a Wrapper on Spotify Open APIs for http://masoudmirzei.ir/coverfinder/'
  });
});

// Set API
app.get('/api/search', function (request, response) {
  return rp({
    uri: 'https://api.spotify.com/v1/search?q='+ request.query.q + '&type=' + request.query["type"] || 'album',
    json: true
  }).then(
    function successCallback(result) {
      return response.json(result);
    },
    function errorCallback() {
      response.status(500);
      response.json({
        message: 'There Was An Error while getting Information from Spotify'
      });
    }
  )
});

app.get('/api/albums/:album_id', function (request, response) {
  return rp({
    uri: 'https://api.spotify.com/v1/albums/' + request.params.album_id,
    json: true
  }).then(
    function successCallback(result) {
      return response.json(result);
    },
    function errorCallback() {
      response.status(500);
      response.json({
        message: 'There Was An Error while getting Information from Spotify'
      });
    }
  )
});


// Run Application at Last
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
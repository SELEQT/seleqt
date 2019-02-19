let express = require('express')
let request = require('request')
let querystring = require('querystring')
let cors = require('cors')                // Need cors to enable API calls from seleqt frontend

require('dotenv').config()

let app = express();

app.use(cors())                           // Use cors

app.use(express.static('frontend/build'));

app.get('/', (req, res) => {
  res.sendFile('index');
});

let redirect_uri =
  process.env.REDIRECT_URI ||
  'http://localhost:8888/callback';

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-playback-state user-modify-playback-state',
      redirect_uri
    }))
})


/*  Spotify callback <-------
    Request access_token and refresh_token from spotify authentication flow

    Send the tokens to the frontend by request.post and put the response in the url
*/
app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  
  request.post(authOptions, function(error, response, body) {
    var refresh_token = body.refresh_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/MainPage'
    res.redirect(uri + '?refresh_token=' + refresh_token)
  })
 
})


/*  Spotify refresh_token API call <---------
    API for renewing access_token.
    Gets current refresh_token as param input and makes an API call to spotify by sending the current refresh_token
    Response from spotify: new accesstoken that is valid for 1 h

    Sends the newly aquired access_token to seleqt frontend by request.post if the API call to spotify was successful
*/
app.get('/refresh_token', function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

if (process.env.NODE_ENV !== 'prodution') require('dotenv').config()

var express = require('express') // Express web server framework
var request = require('request') // "Request" library
var cors = require('cors')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
const path = require('path')

var client_id = process.env.CLIENT_ID // Your client id
var client_secret = process.env.CLIENT_SECRET // Your secret
var redirect_uri = process.env.REDIRECT_URI // Your redirect uri

const PORT = process.env.PORT || 8888

const STATIC_PATH = process.env.NODE_ENV === 'production' ? '/dist' : '/public'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

var stateKey = 'spotify_auth_state'

var app = express()

app.use('/', express.static(path.join(__dirname, STATIC_PATH)))
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.json())

app.get('/login', function (req, res) {

  var state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  var scope = `
    user-read-private
    user-read-email
    ugc-image-upload
    playlist-modify-public
    playlist-modify-private
  `
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }))
})

app.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var state = req.query.state || null
  var storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect('/?' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token

        // we can also pass the token to the browser to make requests from there
        res.redirect('/?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }))
      } else {
        res.redirect('/?' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})


app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  }

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
})

app.put('/change_image', function (req, res) {
  let playlistID = req.query.playlist_id // ID of already created playlist 
  var options = {
    url: 'https://api.spotify.com/v1/playlists/' + playlistID + '/images',
    headers: {
      'Authorization': 'Bearer ' + req.query.access_token,
      'Content-Type': 'image/jpeg'
    },
    body: req.body.data.img
  }

  request.put(options, (error, response) => {
    if (response.statusCode === 202) {
      console.log('Upload cover')
      return res.status(202).send()
    } else {
      return res.status(400).send()
    }
  })

})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

console.log(`Listening on ${PORT}`)
app.listen(PORT)
/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

if (process.env.NODE_ENV !== 'prodution') require('dotenv').config()

const express = require('express') // Express web server framework
const request = require('request') // "Request" library
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

var client_id = process.env.CLIENT_ID // Your client id
var client_secret = process.env.CLIENT_SECRET // Your secret
var redirect_uri = process.env.REDIRECT_URI // Your redirect uri

const PORT = process.env.PORT || 8888
const STATIC_PATH = process.env.NODE_ENV === 'production' ? '/dist' : '/public'
const APP_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  var text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const stateKey = 'spotify_auth_state'

const app = express()

app.use('/', express.static(path.join(__dirname, STATIC_PATH)))
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.json())

/**
 * Application requests authorization from Spotify
 */
app.get('/login', function (req, res) {

  const state = generateRandomString(16)
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = `
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

/**
 * Application requests refresh and access tokens from Spotify
 */
app.get('/callback', function (req, res) {

  const code = req.query.code || null
  const state = req.query.state || null
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (state === null || state !== storedState) {
    res.redirect(`${APP_BASE_URL}/?${querystring.stringify({ error: 'state_mismatch' })}`)
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${(Buffer.from(client_id + ':' + client_secret).toString('base64'))}`
      },
      json: true
    }

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        const access_token = body.access_token,
          refresh_token = body.refresh_token

        // pass token to application
        res.redirect(`${APP_BASE_URL}/?${querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        })
          }`)
      } else {
        res.redirect(`${APP_BASE_URL}/?` +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})


app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': `Basic ${(Buffer.from(client_id + ':' + client_secret).toString('base64'))}`
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

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/index.html'))
})

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error connecting to server')
    throw err
  }
  console.log(`Server listening on ${PORT}`)
})
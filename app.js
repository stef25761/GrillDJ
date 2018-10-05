'use strict';

const auth = require('http-auth');

const express = require('express');
const request = require('request');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const url = require('url');


const websocket = require(path.join(__dirname, path.sep, 'websocket')).getWsInstance();
const spotify = require(path.join(__dirname, path.sep, 'spotify')).spotify();


websocket.init(server);
app.get('/index',(req,res)=>{
   res.send('root')
});
app.use('/index', (req, res) => {
    res.sendFile(path.join(__dirname, path.sep, 'static', path.sep, 'index.html'));
});

app.use('/static', express.static(path.join(__dirname, path.sep, 'static')));
app.get('/admin',(req,res)=>{
    res.send(`Hello from admin area - ${req.user}!`);
});
app.get('/authenticate', (req, res) => {
    let scopes = ['user-read-private user-read-email playlist-modify-private playlist-read-private user-read-currently-playing user-read-playback-state playlist-modify-public '];
    let redirect_uri = 'http://fs-inf-fl.berndlorenzen.de/sucess';
    spotify._spotifyApi.setRedirectURI(redirect_uri);
    let authorizeUrl = spotify._spotifyApi.createAuthorizeURL(scopes, 'state', true);

    //ToDo use state for better security
    res.redirect(authorizeUrl);
});

app.get('/sucess', (req, res) => {

    let redirect_uri = 'http://fs-inf-fl.berndlorenzen.de/sucess';
    let query = url.parse(req.url, true).query;
    let code = query.code;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer('c41189cb617a40998ccd58d2cc114494' + ':' + '0628aec1113e455185747887984496a6').toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
           
            let access_token = body.access_token,
                refresh_token = body.refresh_token;
            spotify._spotifyApi.setAccessToken(access_token);
            spotify._spotifyApi.setRefreshToken(refresh_token);
            let options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {'Authorization': 'Bearer ' + access_token},
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                spotify.setUserName(body.id);

            });
            spotify.refreshToken();
            res.writeHead(200, {'Content-Type': 'text/html'});

            res.write('<p>sucess</p>');
            res.write('<button onclick="handler()" id="forward">weiter zu index</button>');
            res.write('<script>' +
                'function handler () {location.replace("index")}' +
                '</script>');
            res.end();
            //res.write(body);


        }else {
            console.log('error ',error);
            console.log('responseStatusCode ',response.statusCode);
            res.send(response);
        }
    });
});
server.listen(3000);

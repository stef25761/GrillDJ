'use strict';

const SpotifyWebApi = require('spotify-web-api-node');

class spotify {

    constructor() {

        this._playlistId = '2i7NbODEswbn83cfLU4fzW';
        let redirect_uri = 'http://fs.berndlorenzen.de/sucess';
        this._acessToken = '';
        this._spotifyApi = new SpotifyWebApi(
            {
                redirect_uri: redirect_uri,
                clientId: 'c41189cb617a40998ccd58d2cc114494',
                clientSecret: 'd1cc30aee7a1471bb565e3335c84139c'
            });


    }

    setUserName(name) {
        this._userName = name;
    }

    refreshToken() {
        // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
        this._spotifyApi.refreshAccessToken()
            .catch(function(){

            })
            .catch(function (error) {
                instance.errorHandling(error);
            })
            .then(function (data) {
                    //console.log('The access token has been refreshed! ',data.body['access_token']);

                    // Save the access token so that it's used in future calls
                   // this._spotifyApi.setAccessToken(data.body['access_token']);
                },
                function (error) {
                    new Error(error);
                    console.log('Could not refresh access token', error);

                }
            );
    }

    getCurrentPlaybackState(callback) {
        this._spotifyApi.getMyCurrentPlaybackState()
            .catch(function(){

            })
            .catch(function (error) {
                instance.errorHandling(error);

            }).then(function (data) {

            callback(data);
        });
    }

    addTrack(data, callback, desiredPosition) {

        //TODO: addTrackToPlaylist(UserID,PLayListID,uri)
        this._spotifyApi.addTracksToPlaylist(this._userName, this._playlistId, [data],
            {
                position: desiredPosition
            })
            .catch(function(){

            })
            .catch(function (error) {
                instance.errorHandling(error);
            })
            .then(function (data) {
                //ist in den data die geänderte Playlist enthalten?


                callback(data);


            }, function (error) {

                new Error(error);

                callback(data);

            });
    }


    searchTracks(data, callback) {


        // Search tracks whose artist's name contains the given artist and trackName
        this._spotifyApi.searchTracks(data.keyWord)

            .catch(function (error) {
                console.log('error search track ',error);
               instance.errorHandling(error);
            })

            .then(function (data) {

                callback(data);
            });


    }



    getPlayList(callback) {
        this._spotifyApi.getPlaylistTracks(this._userName, this._playlistId)
            .catch(function(){

            })
            .catch(function (error) {
                instance.errorHandling(error);
            })
            .then(function (data) {

                callback(data);
            }, function (err) {

            });
    }
    errorHandling(error){
        console.log('errorHandling ',error);
        switch (error.statusCode) {
            case 400:
                console.log('bad Request');
            case 401:
                console.log('unauthorized');
                instance.refreshToken();
                break;
            case 403:
                console.log(error.statusCode,' forbidden');
            case 429:
                console.log(error.statusCode);
                break;
        }
    }
}

const instance = new spotify();
module.exports.spotify = () => {
    return instance;
};
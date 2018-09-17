'use strict';

const SpotifyWebApi = require('spotify-web-api-node');

class spotify {

    constructor() {
       
        this._playlistId = '2i7NbODEswbn83cfLU4fzW';
        let redirect_uri = 'http://fs-inf-fl.berndlorenzen.de/sucess';
        this._acessToken = '';
        this._spotifyApi = new SpotifyWebApi(
            {
                redirect_uri: redirect_uri,
                clientId: 'c41189cb617a40998ccd58d2cc114494',
                clientSecret: '9934a3c78b214a8c8462ed45625efcee'
            });


    }
    setUserName(name){
        this._userName = name;
    }

    refreshToken() {
        // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
        this._spotifyApi.refreshAccessToken()
            .catch(function (error) {
                
            })
            .then(function (data) {
                console.log('The access token has been refreshed!');

                // Save the access token so that it's used in future calls
                this._spotifyApi.setAccessToken(data.body['access_token']);
            },
            function (err) {
                console.log('Could not refresh access token', err);

            }
        );
    }

    addTrack(data, callback) {

        //TODO: addTrackToPlaylist(UserID,PLayListID,uri)
        this._spotifyApi.addTracksToPlaylist('freakykeyboard1','0qsC4OhzUeGUXckcZ1VQl8',[data])
            .catch(function (error) {
                throw new Error(error);
            })
            .then(function (data) {
                //ist in den data die geänderte Playlist enthalten?


                callback(data);


            }, function (err) {

                console.log(err);

                callback(data);

            });
    }


    searchTracks(data, callback) {


            // Search tracks whose artist's name contains the given artist and trackName
            this._spotifyApi.searchTracks(data.keyWord)
                .catch(function (error){
                
            })
            
                .then(function (data) {

                    callback(data);
                }, function (err) {

                });



    }
    //ToDo delete
    /// no longer needed ?
    /*searchArtist(data,callback){

            // Search tracks whose artist's name contains the given artistName
            this._spotifyApi.searchArtists(data.artistName)
                .catch(function (error) {

                })
                .then(function (data) {

                    callback(data);
                }, function (err) {
                    console.log('Something went wrong!', err);
                    throw new Error(err);
                });


    }*/

    getPlayList(callback) {
        this._spotifyApi.getPlaylistTracks(this._userName, this._playlistId)
            .catch(function (error) {
                
            })
            .then(function (data) {

                callback(data);
            }, function (err) {

            });
    }
}

const instance = new spotify();
module.exports.spotify = () => {
    return instance;
};
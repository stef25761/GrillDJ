'use strict';

const SpotifyWebApi = require('spotify-web-api-node');

class spotify {

    constructor() {
        this._userName = 'freakykeyboard1';
        this._playlistId = '0qsC4OhzUeGUXckcZ1VQl8';
        let redirect_uri = 'http://fs-inf-fl.berndlorenzen.de/sucess';
        this._acessToken = 'BQDOEmx8fBGIDOSoIaN2L0AVe4Ybj4X4f-WPKMBS7y2FGGIp3Kq0VV4z0v7WV28G42vEsb_JaTyp_i6ZK13Xk_vcFM899dmCGWuHFLJUS0krcrevDVrTeFDpTnDv3yC8S-j15yUJ6Vf3NPoPClvCPe4rghibIFKMLPTcwHRxdIKPY91WFWpmCPKv2fuOBvYwko2ZWiFlVO7hNObsI1DPbfHn2k8fw2SfkNtIPz-o_Rz_85wahP0w3Jh3yntLgtgKBRAnN4FKA4LJ-fmJHsg';
        this._spotifyApi = new SpotifyWebApi(
            {
                redirect_uri: redirect_uri,
                clientId: 'c41189cb617a40998ccd58d2cc114494',
                clientSecret: '9934a3c78b214a8c8462ed45625efcee'
            });


    }

    refreshToken() {
        // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
        this._spotifyApi.refreshAccessToken().then(
            function (data) {
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
        //console.log('freakykeaboard1','0qsC4OhzUeGUXckcZ1VQl8',["spotify:track"+data.trackId]);
        this._spotifyApi.addTracksToPlaylist('freakykeyboard1','0qsC4OhzUeGUXckcZ1VQl8',["spotify:track:2d0hyoQ5ynDBnkvAbJKORj"])
            .then(function (data) {
                //ist in den data die geänderte Playlist enthalten?


                callback(data);


            }, function (err) {

                console.log(err);

                callback(data);

            });
    }


    searchTracks(data, callback) {

        if (data.artistName && !data.trackName) {
            // Search tracks whose artist's name contains zhe given artistName
            this._spotifyApi.searchTracks('artist:' + data.artistName)
                .then(function (data) {

                    callback(data);
                }, function (err) {
                    console.log('Something went wrong!', err);
                    throw new Error(err);
                });

        } else if (data.artistName && data.trackName) {
            // Search tracks whose artist's name contains the given artist and trackName
            this._spotifyApi.searchTracks('track:' + data.trackName + ' artist:' + data.artistName)
                .then(function (data) {

                    callback(data);
                }, function (err) {

                });
        } else {
            this._spotifyApi.searchTracks('track:' + data.trackName);
        }


    }

    getPlayList(callback) {
        this._spotifyApi.getPlaylistTracks(this._userName, this._playlistId)
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
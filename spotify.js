'use strict';

const SpotifyWebApi = require('spotify-web-api-node');

class spotify {

    constructor() {
        this._userName = 'freakykeyboard1';
        this._playlistId = '0qsC4OhzUeGUXckcZ1VQl8';
        this._acessToken = 'BQDOEmx8fBGIDOSoIaN2L0AVe4Ybj4X4f-WPKMBS7y2FGGIp3Kq0VV4z0v7WV28G42vEsb_JaTyp_i6ZK13Xk_vcFM899dmCGWuHFLJUS0krcrevDVrTeFDpTnDv3yC8S-j15yUJ6Vf3NPoPClvCPe4rghibIFKMLPTcwHRxdIKPY91WFWpmCPKv2fuOBvYwko2ZWiFlVO7hNObsI1DPbfHn2k8fw2SfkNtIPz-o_Rz_85wahP0w3Jh3yntLgtgKBRAnN4FKA4LJ-fmJHsg';
        this._spotifyApi = new SpotifyWebApi(
            {
                id: 'c41189cb617a40998ccd58d2cc114494',
                secret: '9934a3c78b214a8c8462ed45625efcee'
            });
        this._spotifyApi.setAccessToken(this._acessToken);


    }

    addTrack(data, callback) {
        let a=2,b =2;
        console.log(`Fifteen is ${a + b}.`);
        console.log(`'${this._userName}', '${this._playlistId}',["spotify:track:1301WleyT98MSxVHPZCA6M"]`)
        this._spotifyApi.addTracksToPlaylist(`'${this._userName}', '${this._playlistId}',["spotify:track:1301WleyT98MSxVHPZCA6M"]`)
            .then(function (data) {
                //ist in den data die geänderte Playlist enthalten?


                callback(data.body);


            },function (err){
                console.log(err);
            });
    }





    searchTracks(data, callback) {

        if (data.artistName && !data.trackName) {
            // Search tracks whose artist's name contains zhe given artistName
            this._spotifyApi.searchTracks('artist:' + data.artistName)
                .then(function (data) {

                    callback(data.body);
                }, function (err) {
                    console.log('Something went wrong!', err);
                    throw new Error(err);
                });

        } else {
            // Search tracks whose artist's name contains the given artist and trackName
            this._spotifyApi.searchTracks('track:'+data.trackName+' artist:'+data.artistName)
                .then(function (data) {

                    callback(data.body);
                }, function (err) {

                });
        }


    }

    getPlayList(callback) {
        this._spotifyApi.getPlaylistTracks(this._userName, this._playlistId)
            .then(function(data){

            callback(data);
        },function(err){

            });
    }
}

const instance = new spotify();
module.exports.spotify = () => {
    return instance;
};
'use strict';
const path=require('path');

const spotify=require(path.join(__dirname,path.sep,'spotify')).spotify();
class websocket {
    constructor() {
    this._client=0;
    }

    init(server) {

        this._io = require('socket.io')(server);

        this._io.on('connection', (socket) => {
            this._client++;

            console.log('clients verbunden ',this._client);
            spotify.getCurrentPlaybackState((data) => {
                socket.emit('playbackState', data);
            });
            spotify.getPlayList((data) => {

                socket.emit('playListUpdate', data);
            });

            socket.on('addTrack', (data) => {


                spotify.addTrack(data, (data) => {
                    if (data.statusCode === 200) {
                        this._io.emit('playListUpdate', data);
                    } else if (data.statusCode === 401) {
                        spotify.refreshToken();
                        spotify.addTrack(data, (data) => {
                            this._io.emit('playListUpdate', data);
                        });
                    }


                });
            });
            //ToDo: delete
            //no longer needed ?
            /* socket.on('searchArtist',(data)=>{
                 console.log('search '+JSON.stringify(data));
                spotify.searchArtist(data,(data)=>{
                    if (data.statusCode===200){
                        socket.emit('artistData',(data));
                    }else if (data.statusCode===401){
                        spotify.refreshToken();
                        socket.emit('artistData',(data));
                    }

                 });
             });*/
            socket.on('getPlaylist', (data) => {
                spotify.getPlayList((data) => {
                    socket.emit('playListUpdate', data);
                });
            });
            socket.on('searchTrack', (data) => {


                spotify.searchTracks(data, (data) => {

                    if (data.statusCode === 200) {
                        socket.emit('trackData', (data));
                    } else if (data.statusCode === 401) {
                        spotify.refreshToken();
                    }
                });
            });
            var myInt = setInterval(function () {
                spotify.getCurrentPlaybackState((data) => {
                    console.log('playbackState ',data);
                    socket.emit('playbackState', data);
                });
            }, 1000*30);
            socket.on('disconnect',()=>{
                this._client--;
                console.log('clients verbunden ',this._client);
            })
        });



    }
}

const ws = new websocket();
module.exports.getWsInstance = () => {
    return ws;
};
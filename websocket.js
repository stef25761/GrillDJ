'use strict';
const path=require('path');

const spotify=require(path.join(__dirname,path.sep,'spotify')).spotify();
class websocket {
    constructor() {

    }

    init(server) {
        this._io = require('socket.io')(server);

        this._io.on('connection', (socket)=> {
            console.log('client verbunden');
            spotify.getPlayList((data)=>{

                socket.emit('playListUpdate',data);
            });

            socket.on('addTrack',(data)=>{
                console.log('addtrack '+data.trackId);
                spotify.addTrack(data,(data)=>{
                     this._io.emit('playListUpdate',data);
                });
            });
            socket.on('search',(data)=>{
                console.log('search '+JSON.stringify(data));
               spotify.searchTracks(data,(data)=>{
                   socket.emit('searchData',(data));
                });
            });

        });

    }

}

const ws = new websocket();
module.exports.getWsInstance = () => {
    return ws;
};
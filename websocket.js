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
                console.log('adTrack',data);

                spotify.addTrack(data,(data)=>{
                    if (data.statusCode===200){
                        this._io.emit('playListUpdate',data);
                    }else if(data.statusCode===401){
                        spotify.refreshToken();
                        spotify.addTrack(data,(data)=>{
                            this._io.emit('playListUpdate',data);
                        });
                    }


                });
            });
            //ToDo delete
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
           socket.on('getPlaylist',(data)=>{
              spotify.getPlayList((data)=>{
                 socket.emit('playListUpdate',data);
              });
           });
            socket.on('searchTrack',(data)=>{
                console.log('websocket');
                console.log(data);
                spotify.searchTracks(data,(data)=>{

                    if (data.statusCode===200){
                        socket.emit('trackData',(data));
                    } else if (data.statusCode===401){
                        spotify.refreshToken();
                    }
                });
            });


        });

    }

}

const ws = new websocket();
module.exports.getWsInstance = () => {
    return ws;
};
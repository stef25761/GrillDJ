'use strict';

class websocket {
    constructor() {

    }

    init(server) {
        let io = require('socket.io')(server);

        io.on('connection', function () {
            /* … */
        });

    }

}

const ws = new websocket();
module.exports.getWsInstance = () => {
    return ws;
};
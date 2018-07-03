'use strict';



const app = require('express')();
const server = require('http').createServer(app);
const path=require('path');
const websocket=require(path.join(__dirname,path.sep,'websocket')).getWsInstance();

websocket.init(server);

app.get('/',(req,res)=>{
//html ausliefern
    res.sendFile(path.join(__dirname,path.sep,  'index.html'));
});
server.listen(3000);
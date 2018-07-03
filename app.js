'use strict';


const express=require('express');
const app = express();
const server = require('http').createServer(app);
const path=require('path');
const websocket=require(path.join(__dirname,path.sep,'websocket')).getWsInstance();

websocket.init(server);

app.use(express.static(path.join(__dirname,path.sep,'static',path.sep,'index.html')));
app.use('/static',express.static(path.join(__dirname,path.sep,'static')));

server.listen(3000);

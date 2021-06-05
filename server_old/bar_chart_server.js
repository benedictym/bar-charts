console.log('server_old is starting...');
const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const routes = require('./route');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

app.set("port", process.env.PORT || 8080);
const path_views = path.join(__dirname, "views")
app.set("views", path_views );
app.set("view engine", "ejs");

// app.use(cors());
// configure body parsing middleware
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/'));
app.use(routes);
app.listen(app.get("port"), () => {
    console.log(`Server started on at http://localhost:${app.get('port')}`);
});

// let userCount = 0;
// wss.on('connection', (ws) => {
//     userCount ++;
//     ws.send({count: userCount});
//     // wss.emit('message', {count: userCount});
//     ws.on('disconnect', () => {
//         userCount--;
//         ws.send({count: userCount});
//     })
// })
//


// const io = require('socket.io').listen(8080);
// let userCount = 0;
// io.sockets.on('connection', function (socket) {
//     userCount++;
//     io.sockets.emit('message', {count: userCount});
//     
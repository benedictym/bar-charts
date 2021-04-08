console.log('server is starting...');
const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');
const sassMiddleware = require('node-sass-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({port: 8080});
// const passport = require('passport');
// const session = require('express-session');
// const flash = require("connect-flash");

// connect to database
// const MongoClient = require("mongodb").MongoClient;
// const mongo_pass = fs.readFileSync("public/mongo_pass.txt");
// const uri = `mongodb+srv://benedictym:${mongo_pass}@lineages.mniij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex:true
// });

app.set("port", process.env.PORT || 8080);
const path_views = path.join(__dirname, "views")
app.set("views", path_views );
app.set("view engine", "ejs");
// app.use("/public", express.static('public'));
// app.use(sassMiddleware({
//     src: path.join(__dirname, 'public'),
//     dest: path.join(__dirname, 'public'),
//     outputStyle: 'compressed',
//     sourceMap: true
// }));
app.use(cors());
// configure body parsing middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
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
//     socket.on('discount', function () {
//         userCount--;
//         io.sockets.emit('message', {count: userCount})
//     })
// })


// app.use(express.static('../views'));
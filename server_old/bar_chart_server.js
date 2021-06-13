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
app.set("ipAddress", "localhost");
const path_views = path.join(__dirname, "views")
app.set("views", path_views );
app.set("view engine", "ejs");

// app.use(cors());
// configure body parsing middleware
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use(routes);
app.listen(app.get("port"), () => {
    console.log(`Server started on at http://${app.get("ipAddress")}:${app.get('port')}`);
});

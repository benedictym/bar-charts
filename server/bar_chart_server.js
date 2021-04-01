console.log('server is starting...');
const fs = require("fs");
const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');
const passport = require('passport');
const session = require('express-session');
const flash = require("connect-flash");

// connect to database
const MongoClient = require("mongodb").MongoClient;
const mongo_pass = fs.readFileSync("public/mongo_pass.txt");
const uri = `mongodb+srv://benedictym:${mongo_pass}@lineages.mniij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
});

app.set("port", process.env.PORT || 8080);

const path_views = path.join(__dirname, "views")
app.set("views", path_views );
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(routes);
app.listen(app.get("port"), () => {
    console.log(`Server started on at http://localhost:${app.get('port')}`);
});


// app.use(express.static('../views'));
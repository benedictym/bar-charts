const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const Lineages = require('./public/lineage_server');

const jsonParser = bodyParser.json();

//generate secret for cookie
const salt1 = bcrypt.genSaltSync();
const salt2 = bcrypt.genSaltSync();
const secret = bcrypt.hashSync(salt1 + salt2, 8);

router.use(session({
    secret: secret,
    // creates new session to each request to server
    resave: false,
    saveUninitialized: true,
    //max age 2 hours
    cookie: {maxAge: 7200000, secure: false}

}));

router.get("/", function (req, res){
    console.log('the web page has opened ...');
    console.log(req.sessionID);
    res.render("intro");
});

router.get("/consent-form", function (req, res){
    res.render("consent-form");
});


const lineages = [new Lineages(0), new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5)];

router.get("/task/json", function (req,res,next) {
    if(!lineages[0].occupied){
        lineages[0].occupied = true;
        res.send(lineages[0]);
    } else if(!lineages[1].occupied){
        lineages[1].occupied = true;
        res.send(lineages[1]);
    } else if(!lineages[2].occupied){
        lineages[2].occupied = true;
        res.send(lineages[2]);
    } else if(!lineages[3].occupied){
        lineages[3].occupied = true;
        res.send(lineages[3]);
    } else if(!lineages[4].occupied){
        lineages[4].occupied = true;
        res.send(lineages[4]);
    } else if(!lineages[5].occupied){
        lineages[5].occupied = true;
        res.send(lineages[5]);
    } else{
        res.send({});
    }
});

router.post("/task/json", jsonParser, function (req, res){
    let curr_lineage = req.body;
    let lin_id = curr_lineage.lineage_id;
    let lin = lineages[lin_id];
    lin.occupied = false;
    lin.chains = curr_lineage.chains;
    lineages[lin_id] = lin;
    console.log(lineages[lin_id]);
});

router.get("/task", function (req, res) {
    res.render("task");
});

let surveyCodes = [];
let cookieCode = {};
router.get("/exit/codes", function (req, res) {
    console.log(req.sessionID);
    // cookieCode[req.sessionID] = [];
    let exitCode = {
        surveyCodes: surveyCodes,
        cookieCode: cookieCode,
        cookie: req.sessionID
    }
    res.send(exitCode);
    // res.send(surveyCodes);
})

router.post("/exit/codes", jsonParser, function (req, res){
    let currentCode = req.body;
    console.log(currentCode.code);
    if(!surveyCodes.includes(currentCode.code)){
        surveyCodes.push(currentCode.code);
    }
    console.log(surveyCodes);
    let cookie = currentCode.cookie;
    cookieCode[cookie] = currentCode.code;
    console.log(cookieCode);
})
router.get("/exit", function (req, res) {
    res.render("exit");
});

router.get("/unavailable", function (req,res) {
    res.render("unavailable");
})

module.exports = router;
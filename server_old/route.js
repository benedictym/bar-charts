const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
// const {uploadFile} = require('buckets');
const Lineages = require('./public/lineage_server');
const fs = require('fs');
const jsonParser = bodyParser.json();
const {Storage} = require('@google-cloud/storage');
const directory = "/tmp";

const bucketName = "bar-colour.appspot.com";

const storage = new Storage();

async function uploadFile(filePath, fileName){
    await storage.bucket(bucketName).upload(filePath,{
        destination: fileName
    });
    console.log(`${filePath} uploaded to ${bucketName}`);
}
async function write2cloud(fileName, fileWrite) {
    // fileWrite is what to write to the file
    let path = "/tmp/" + fileName + ".txt";
    let stream = fs.createWriteStream(path);
    stream.on("open", () => {
        stream.write(fileWrite);
    });
    await uploadFile(path, fileName);
    fs.unlink(path, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(`successfully deleted: ${path}`);
        }
    })
}
function getFormattedTime() {
    let today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + '-' + m + '-' + d + '-' + h + '-' + mi + '-' + s;
}
// module.exports = uploadFile;

//generate secret for cookie
const salt1 = bcrypt.genSaltSync();
const salt2 = bcrypt.genSaltSync();
const secret = bcrypt.hashSync(salt1 + salt2, 8);

router.use(express.urlencoded({
    extended: true
}));

router.use(session({
    secret: secret,
    // creates new session to each request to server_old
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
    let lineageJson;
    let cookie = req.sessionID;

    if(lineages[0].occupied === "false"){
        lineages[0].occupied = "true";
        lineageJson = {
            lineageJson: lineages[0],
            cookie: cookie
        }
        res.send(lineageJson);
    } else if(lineages[1].occupied === "false"){
        lineages[1].occupied = "true";
        lineageJson = {
            lineageJson: lineages[1],
            cookie: cookie
        }
        res.send(lineageJson);
    } else if(lineages[2].occupied === "false"){
        lineages[2].occupied = "true";
        lineageJson = {
            lineageJson: lineages[2],
            cookie: cookie
        }
        res.send(lineageJson);
    } else if(lineages[3].occupied === "false"){
        lineages[3].occupied = "true";
        lineageJson = {
            lineageJson: lineages[3],
            cookie: cookie
        }
        res.send(lineageJson);
    } else if(lineages[4].occupied === "false"){
        lineages[4].occupied = "true";
        lineageJson = {
            lineageJson: lineages[4],
            cookie: cookie
        }
        res.send(lineageJson);
    } else if(lineages[5].occupied === "false"){
        lineages[5].occupied = "true";
        lineageJson = {
            lineageJson: lineages[5],
            cookie: cookie
        }
        res.send(lineageJson);
    } else{
        res.send({});
    }
});

router.post("/task/json", jsonParser, function (req, res){
    let curr_lineage = req.body;
    let cookie = curr_lineage.cookie;
    let lin_id = curr_lineage.lineage_id;
    let lin = lineages[lin_id];
    lin.occupied = "false";
    const lineageObj = {
        lineage_id: lin_id,
        cookie: cookie,
        chains: curr_lineage.chains,
        gelmanRubin: curr_lineage.gelmanRubin,
        valid: curr_lineage.valid,
        sides: curr_lineage.sides,
        no_choices: curr_lineage.no_choices
    };

    if(!curr_lineage.valid){
        let session_chains = curr_lineage.session_len;
        let chains = curr_lineage.chains;
        for(let i=0; i < chains.length; i++){
            let session_length = session_chains[i];
            (chains[i].selected_colours).splice(-session_length);
        }
        curr_lineage.chains = chains;
    }

    lin.chains = curr_lineage.chains;
    lineages[lin_id] = lin;
    console.log(lineages[lin_id]);

    const lineageJson = JSON.stringify(lineageObj);
    const fileName = lin_id + ":" + cookie + "_" + getFormattedTime();
    write2cloud(fileName, lineageJson).then(r => console.log("lineage written"));

});

router.get("/task", function (req, res) {
    res.render("task");
});

let surveyCodes = [];
let cookieCode = {};

router.get("/exit/codes", function (req, res) {
    console.log(req.sessionID);

    let exitCode = {
        surveyCodes: surveyCodes,
        cookieCode: cookieCode,
        cookie: req.sessionID
    }
    res.send(exitCode);
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
    const cookieJson = JSON.stringify(cookieCode);

    write2cloud("cookie_codes", cookieJson).then(r => console.log("cookie exit codes updated"));
});

router.get("/exit", function (req, res) {
    res.render("exit");
});

router.post("/exit/form", function (req, res) {
    let form = JSON.parse(JSON.stringify(req.body));
    let form_text = [];
    Object.keys(form).forEach(function (key) {
        form_text.push(form[key]);
    })
    console.log(form_text);
    res.end();

})

router.get("/unavailable", function (req,res) {
    res.render("unavailable");
})



module.exports = router;

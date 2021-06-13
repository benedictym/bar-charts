const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const uploadFile = require('./buckets');
const Lineages = require('./public/lineage_server');
const fs = require('fs');
const jsonParser = bodyParser.json({limit: '500mb'});
// const urlParser = bodyParser.urlencoded({limit: '500mb', extended: true});
const {Storage} = require('@google-cloud/storage');
const directory = "/tmp";
router.use(jsonParser);
router.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 50000 }));
// router.use(express.urlencoded({
//     limit: '500mb',
//     extended:true,
//     parameterLimit: 50000
// }));

// const bucketName = "web-colour-bucket";
//
// const storage = new Storage();
//
// async function uploadFile(filePath, fileName){
//     await storage.bucket(bucketName).upload(filePath,{
//         destination: fileName
//     });
//     console.log(`${filePath} uploaded to ${bucketName}`);
// }
async function write2cloud(fileName, fileWrite, fileType) {
    // fileWrite is what to write to the file

    let path = "/tmp/" + fileName + ".txt";
    let stream = fs.createWriteStream(path);
    stream.on("open", () => {
        stream.write(fileWrite);
    });
    let fileDest;
    switch(fileType["file_type"]) {
        case "lineage":
            let lineage_no = fileType.no;
            fileDest = "lineage" + lineage_no + "/" + fileName + ".txt";
            break;
        case "cookie_codes":
            fileDest = "cookieCodes/" + fileName + ".txt";
            break;
        case "comment":
            fileDest = "comments/" + fileName + ".txt";
            break;
        case "lin_store":
            fileDest = "lineages" + fileName + ".txt";
            break;
    }
    await uploadFile(path, fileDest);
    fs.unlink(path, function (err) {
        if (err) {
            throw err;
        } else {
            console.log(`successfully deleted: ${path}`);
        }
    })
}

async function downloadFile(fileName, destFileName) {
    const options = {
        //path where file should be downloaded
        destination: destFileName,
    };

    // Downloads the file
    await storage.bucket(bucketName).file(fileName).download(options);

    // filename in bucket
    console.log(
        `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
    );
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
// router.use(jsonParser);
// router.use(express.urlencoded({
//     limit: '500mb'}));

router.use(session({
    secret: secret,
    // creates new session to each request to server_old
    resave: false,
    saveUninitialized: true,
    //max age 2 hours
    cookie: {maxAge: 7200000, secure: false}

}));

// router.get("/", function (req, res){
//     console.log('the web page has opened ...');
//     console.log(req.sessionID);
//     res.render("intro");
// });

router.get("/consent-form", function (req, res){
    res.render("consent-form");
});

const lineages = [new Lineages(0), new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5)];

router.post("/task/occupied", function (req, res) {
    let curr_lineage = req.body;
    let lin_id = curr_lineage.lineage_id;
    let lin = lineages[lin_id];
    lin.occupied = "false";
    lineages[lin_id] = lin;
    console.log(lin);
});

//old task json
//
// router.get("/task/json", async function (req, res) {
//     let cookie = req.sessionID;
//     let lineage_choice = null;
//     for(let i = 0; i < lineages.length; i++){
//         lineages[i].lineageState();
//     }
//
//     for(let j = 0; j < lineages.length; j++){
//         if(lineages[j].occupied === "false"){
//             lineages[j].occupied = "true"
//             lineage_choice = lineages[j];
//             break;
//         }
//     }
//     if(lineage_choice !== null){
//         // get lineage from server
//         let lineage_no = lineage_choice.lineage_id;
//         let path = "lineages/lineage_" + lineage_no + ".txt"
//         let download_to = "/tmp/lineage_" + lineage_no + ".txt";
//         await downloadFile(path, download_to);
//         await fs.readFile(download_to,'utf-8',function (err, data) {
//             if(err) throw err;
//             console.log(data);
//             console.log(data.toString());
//             console.log("data printed");
//             let lineageJSON = {
//                 lineageJson: JSON.parse(data.toString()),
//                 cookie: cookie
//             }
//             console.log(lineageJSON.lineageJson);
//             res.send(lineageJSON);
//         });
//         //
//         // fs.unlink(download_to, function (err) {
//         //     if (err) {
//         //         throw err;
//         //     } else {
//         //         console.log(`successfully deleted: ${download_to}`);
//         //     }
//         // })
//
//         // fs.readFile(download_to, 'utf8', function(err,data){
//         //     if(err) throw err;
//         //     let obj = JSON.parse(data);
//         // });
//         // let lineageJSON = {
//         //     lineageJson: obj;
//         // }
//         // res.send(lineageJSON)
//     } else {
//         res.send({});
//     }
// })

router.get("/task/json", function (req,res,next) {
    let lineageJson;
    let cookie = req.sessionID;

    console.log(lineages[0].lineage_id);
    console.log(lineages[0].occupied);
    console.log(lineages[1].lineage_id);
    console.log(lineages[1].occupied);
    console.log(lineages[2].lineage_id);
    console.log(lineages[2].occupied);
    console.log(lineages[3].lineage_id);
    console.log(lineages[3].occupied);
    console.log(lineages[4].lineage_id);
    console.log(lineages[4].occupied);
    console.log(lineages[5].lineage_id);
    console.log(lineages[5].occupied);

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

// router.post("/task/json", async function (req, res){
//     let curr_lineage = req.body;
//     let cookie = curr_lineage.cookie;
//     let lin_id = curr_lineage.lineage_id;
//     let lin = lineages[lin_id];
//     lin.occupied = "false";
//     const lineageObj = {
//         lineage_id: lin_id,
//         cookie: cookie,
//         chains: curr_lineage.chains,
//         gelmanRubin: curr_lineage.gelmanRubin,
//         valid: curr_lineage.valid,
//         sides: curr_lineage.sides,
//         no_choices: curr_lineage.no_choices
//     };
//
//     const lineageJson = JSON.stringify(lineageObj);
//     const fileName = lin_id + ":" + cookie + "_" + getFormattedTime();
//     const fileType = {
//         file_type: "lineage",
//         no: lin_id
//     }
//     // write2cloud(fileName, lineageJson, fileType).then(r => console.log("lineage written"));
//
//     // if(!curr_lineage.valid){
//     //     let session_chains = curr_lineage.session_len;
//     //     let chains = curr_lineage.chains;
//     //     for(let i=0; i < chains.length; i++){
//     //         let session_length = session_chains[i];
//     //         (chains[i].selected_colours).splice(-session_length);
//     //     }
//     //     curr_lineage.chains = chains;
//     // }
//     //
//     // let path = "lineages/lineage_" + lin_id + ".txt"
//     // let download_to = "LineagesJSON/lineage_" + lin_id + ".txt";
//     // await downloadFile(path, download_to);
//     // fs.readFile(download_to, function (err, data) {
//     //     if(err) throw err;
//     //     let lin = JSON.parse(data.toString());
//     //     lin.chains = curr_lineage.chains;
//     //     let linJSON = JSON.stringify(lin);
//     //     const fileName = lin_id + ".txt";
//     //     const fileType = {
//     //         file_type: "lin_store"
//     //     };
//     //     write2cloud(fileName, linJSON, fileType).then(r => console.log("lineage saved"));
//     //
//     // });
//
//     lineages[lin_id] = lin;
//     console.log(lineages[lin_id]);
//
// });

router.post("/task/json", function (req, res){
    let curr_lineage = req.body;
    let cookie = curr_lineage.cookie;
    let lin_id = curr_lineage.lineage_id;
    let lin = lineages[lin_id];
    // lin.occupied = "false";
    const lineageObj = {
        lineage_id: lin_id,
        cookie: cookie,
        chains: curr_lineage.chains,
        gelmanRubin: curr_lineage.gelmanRubin,
        valid: curr_lineage.valid,
        sides: curr_lineage.sides,
        no_choices: curr_lineage.no_choices
    };

    const lineageJson = JSON.stringify(lineageObj);
    const fileName = lin_id + ":" + cookie + "_" + getFormattedTime();
    const fileType = {
        file_type: "lineage",
        no: lin_id
    }

    write2cloud(fileName, lineageJson, fileType).then(r => console.log("lineage written")).catch(e => {
        console.log("promise error with writing file to google cloud bucket");
        console.error(e)
    });

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

let no_users = 0;

router.post("/exit/codes", function (req, res){
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
    const fileName = no_users + ":" + "cookie_codes";
    const fileType = {
        file_type: "cookie_codes",
        no: no_users
    };

    write2cloud(fileName, cookieJson, fileType).then(r => console.log("cookie exit codes updated")).catch(e => {
        console.log("promise error with writing code file to google cloud bucket");
        console.error(e);
    })
    no_users ++;
});

router.get("/exit", function (req, res) {
    res.render("exit");
});

router.post("/exit/form", function (req, res) {
    // let form = req.body
    // // const cookie = form['cookie'];
    let form = JSON.parse(JSON.stringify(req.body));
    let form_text = [];
    Object.keys(form).forEach(function (key) {
        // form_text.push(key);
        form_text.push(key);
    })
    const fileName = no_users + "_message";
    const fileType = {
        file_type: "comment"
    };
    form_text = form_text[0]
    write2cloud(fileName, form_text, fileType).then(r => console.log("comment sent")).catch(e => {
        console.log("promise error with writing message file to google cloud bucket");
        console.error(e)
    });

    console.log(form_text);
    res.end();

})

router.get("/unavailable", function (req,res) {
    res.render("unavailable");
})

router.get("/", function (req, res){
    console.log('the web page has opened ...');
    console.log(req.sessionID);
    res.render("intro");
});


// router.get(/^(?!.*_ah).*$/,(req,res,next)=>{
// })

module.exports = router;

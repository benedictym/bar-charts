const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Lineages = require('./public/lineage_server');

// router.use(bodyParser.json({ type: 'application/*+json' }));
const jsonParser = bodyParser.json();
router.get("/", function (req, res){
    console.log('the web page has opened ...');
    res.render("intro");
});

router.get("/consent-form", function (req, res){
    res.render("consent-form");
});


let userCount = 0;
const lineages = [new Lineages(0), new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5)];
let lineage;

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
    let lin = lineages[0];
    lin.occupied = false;
    lin.chains = curr_lineage.chains;
    lineages[0] = lin;
    console.log(lineages[0]);
});

router.get("/task", function (req, res) {
    res.render("task");

});

router.get("/exit", function (req, res) {
    res.render("exit");
});

router.get("/unavailable", function (req,res) {
    res.render("unavailable");
})

module.exports = router;
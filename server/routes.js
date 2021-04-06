const express = require('express');
const router = express.Router();
const Lineages = require('./public/lineage_server');

router.get("/", function (req, res){
    console.log('the web page has opened ...');
    res.render("intro");
});

router.get("/consent-form", function (req, res){
    res.render("consent-form");
})

let userCount = 0;
let lineages = [new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5), new Lineages(6)];
router.get("/task", function (req, res) {
    userCount++;
    console.log(userCount);
    if(userCount <= 6){
        let lineage;
        switch (userCount) {
            case 1:
                lineage = lineages[0];
                break
            case 2:
                lineage = lineages[1];
                break
            case 3:
                lineage = lineages[2];
                break
            case 4:
                lineage = lineages[3];
                break
            case 5:
                lineage = lineages[4];
                break
            case 6:
                lineage = lineages[5];
        }
        res.render("task", {lineage: lineage});
    } else{
        userCount--;
        res.send("The website server is full right now please come back in an hour and try again.");
    }
})

router.get("/exit", function (req, res) {
    userCount--;
    res.render("exit");
})

module.exports = router;
const express = require('express');
const router = express.Router();

router.get("/", function (req, res){
    console.log('the web page has opened ...');
    res.render("intro");
});

router.get("/consent-form", function (req, res){
    res.render("consent-form");
})

router.get("/task", function (req, res) {
    res.render("task");
})

router.get


module.exports = router;
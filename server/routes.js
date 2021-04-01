const express = require('express');
const router = express.Router();

router.get("/", function (req, res){
    console.log('the web page has opened ...');
    res.render("index");
});

module.exports = router;
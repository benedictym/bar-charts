// const Chain = require("server/public/bar-charts");
// const start_chain = require("server/public/bar-charts");
import {Chain} from "./bar-charts.js";
import {start_chain} from "./bar-charts.js";
// import 'socket.io'
// const url = 'wss://wss://flavio-websockets-server-example.glitch.me'
// const vr = require('vanilla-require')(__dirname);
// const {Chain} = vr.require('./bar-charts.js');
// const {start_chain} = vr.require('./bar-charts.js');
// const execfile = require('../execfile');
// const bc = execfile("./barchart.js");
// const fs = require("fs");


class Lineages {
    constructor(lineage_id) {
        this.lineage_id = lineage_id;
        this.occupied = false;
        this.chains = [];
    }

    add_chains(add_chains){
        this.chains.push(add_chains);
    }

    lineageState(){
    }
}

const lineages = [new Lineages(1)];

function initiateLineage(lineages) {
    let lineage_no = 0;

    console.log(lineage_no);
    let current_lineage = lineages[lineage_no];
    if (current_lineage.occupied){
        let j = 0;
        while(j < 6){
            current_lineage = lineage_no[lineage_no + j];
            if (!current_lineage.occupied){break;}
        }
    } else{
        current_lineage.occupied = true;
    }
    let chains = current_lineage.chains;
    if (chains.length === 0) {
        chains = [new Chain(0), new Chain(1), new Chain(2), new Chain(3), new Chain(4)];
        current_lineage.add_chains(chains);
        }
     start_chain(chains);
}

initiateLineage(lineages);
// const Chain = require("server/public/bar-charts");
// const start_chain = require("server/public/bar-charts");
import {Chain} from "./bar-charts.js";
import {start_chain} from "./bar-charts.js";

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

const lineages = [new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5), new Lineages(6)]

function initiateLineage() {
    let i = 0;
    let j = 0;
    // while (i <= 100000) {
    let lineage_no = i % lineages.length;
    console.log(lineage_no);
    let current_lineage = lineages[lineage_no];
    let chains = current_lineage.chains;
    if (chains.length === 0) {
        chains = [new Chain(0), new Chain(1), new Chain(2), new Chain(3), new Chain(4)];
        current_lineage.add_chains(chains);
        }
     start_chain(chains);
    // j++
    // console.log(j);
        // sort out what to do if lineage occupied
        // let j = 0
        // while (j<6){
        //     if (current_lineage.occupied){
        //         lineage_no +=1;
        //         i++;
        //
        //     }
}
initiateLineage()
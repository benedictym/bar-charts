// const Chain = require("server_old/public/bar-charts");
// const start_chain = require("server_old/public/bar-charts");
import {BarChart, Chain, start_chain} from "./bar-charts.js";

function isEmpty(obj){
    return Object.keys(obj).length === 0;
}

const loadLineage = async () => {
    const response = await fetch("https://bar-colour.nw.r.appspot.com/task/json");
    const res = await response.json();
    return res;
}

const postLineage = (lineage_json) => {
    fetch("https://bar-colour.nw.r.appspot.com/task/json", {
        headers: {'Content-Type': "application/json"},
        method: 'post',
        body: lineage_json
    })
        .then(function (res){console.log(res)})
        .catch(function (res) {console.log(res)});

    window.location.href = "/exit";
}

// const quickSave = (lineage_json) => {
//     window.addEventListener("beforeunload", function () {
//         fetch("http://localhost:8080/task/json", {
//             headers: {'Content-Type': "application/json"},
//             method: 'post',
//             body: lineage_json
//         })
//             .then(function (res){console.log(res)})
//             .catch(function (res) {console.log(res)});
//     })
// }

async function initiateLineage() {

    const current_lineage = await loadLineage();
    if(isEmpty(current_lineage)){
        window.location.href = "/unavailable";
    }
    let lineage_no = current_lineage.lineage_id;

    console.log(lineage_no);

    let chains = current_lineage.chains;
    let chain_list;
    if (chains.length === 0) {
        chain_list = [new Chain(0), new Chain(1), new Chain(2), new Chain(3), new Chain(4)];
    } else{
        chain_list = [];
        for (let i = 0; i < chains.length; i++){
            let new_chain = new Chain(i);
            for(let j = 0; j < chains[i]['selected_colours'].length; j++){
                let bar_chart = chains[i]['selected_colours'][j];
                let new_chart = new BarChart(bar_chart.lightness, bar_chart.chromatic_a, bar_chart.chromatic_b);
                new_chain.add_results(new_chart);
            }
            chain_list.push(new_chain);
        }
    }

    // current_lineage.chains = await start_chain(chain_list, current_lineage);
    await start_chain(chain_list, current_lineage);
    // console.log(current_lineage.chains);
    // const lineage_json = JSON.stringify(current_lineage);
    // // quickSave(lineage_json);
    // postLineage(lineage_json);
}

initiateLineage();

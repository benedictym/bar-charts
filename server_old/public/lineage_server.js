class Lineages {
    constructor(lineage_id) {
        this.lineage_id = lineage_id;
        this.occupied = "false";
        this.chains = [];
    }

    add_chains(add_chains){
        this.chains.push(add_chains);
    }

    lineageState(){
    }
}
// const lineages = [new LineagesJSON(1), new LineagesJSON(2), new LineagesJSON(3), new LineagesJSON(4), new LineagesJSON(5), new LineagesJSON(6)]

module.exports = Lineages;
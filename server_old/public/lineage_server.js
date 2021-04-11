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
// const lineages = [new Lineages(1), new Lineages(2), new Lineages(3), new Lineages(4), new Lineages(5), new Lineages(6)]

module.exports = Lineages;
class Lineages {
    constructor(lineage_id, chain) {
        this.lineage_id = lineage_id;
        this.chain = chain;
        this.occupied = false;
    }
}

function confirmRead() {
    if(document.getElementById("participation-sheet").checked){
        window.location.href = "/task";
    } else {
        alert("If you do not accept the conditions please return the HIT.");
        return false;
    }
}



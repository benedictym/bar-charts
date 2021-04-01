class Ellipse {
    constructor(radiusX, radiusY) {
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }

    // taken from Will
    // checks to see if coordinates
    is_legal() {
        return (!(this.radiusX < 0 || this.radiusX > 350) && !(this.radiusY < 0 || this.radiusY > 350));
    }

    draw_ellipse(canvas){
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 350, 350);
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#757575";
        ctx.fillStyle = "#C4C4C4";

        ctx.ellipse(175, 175, this.radiusX, this.radiusY, 0, 0 , 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    //taken from Will
    //not sure if I will use it yet
    toString(){
        return("RadiusX: " + this.radiusX.toString() + "RadiusY: " + this.radiusY.toString());
    }
}

// taken from Will
class Chain{
    constructor(chain_no) {
        this.chain_no = chain_no;
    }
    selected_ellipses = [];

    add_results(ellipse) {
        this.selected_ellipses.push([ellipse.radiusX, ellipse.radiusY]);
    }

    state() {
        if (this.selected_ellipses.length === 0) {
            return null;
        } else {
            return this.selected_ellipses[this.selected_ellipses.length - 1];
        }
    }

    print_chain(){
        return("chain no.: " + this.chain_no.toString());
    }
}

const [l_canvas, r_canvas] = document.querySelectorAll('canvas');
const chain0 = new Chain(0);
const chain1 = new Chain(1);
const chain2 = new Chain(2);

const buttons = document.querySelectorAll('button');
console.log(buttons);

function change(chain) {

    var current_ellipse = chain.state();
    var new_ellipse = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1));
    let side = Math.round(Math.random());

    if (current_ellipse == null) {
        current_ellipse = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1));
    }
    // if you get side 0 draw on left side
    if (side === 0) {
        current_ellipse.draw_ellipse(l_canvas);
        new_ellipse.draw_ellipse(r_canvas);
    } else {
        current_ellipse.draw_ellipse(r_canvas);
        new_ellipse.draw_ellipse(l_canvas);
    }

    return new Promise(resolve => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", function () {
                if ((buttons[i].id === 'left' && side === 0) || (buttons[i].id === 'right' && side === 1)) {
                    chain.add_results(current_ellipse);
                }else{
                    chain.add_results(new_ellipse);
                }
            })
        }
        resolve(chain);
    })

}

async function start_chain(){
    try {
        let i = 0;
        let chain_no = i % 3;
        let chain = null;
        chain = await change(chain0);
        console.log(chain.print_chain());
        console.log(chain.selected_ellipses);
        chain = await change(chain1);
        console.log(chain.print_chain());
        console.log(chain.selected_ellipses);
        chain = await change(chain2);
        console.log(chain.print_chain());
        console.log(chain.selected_ellipses);
        i++;
    } catch (err) {
        console.log("Error", err.message);
    }
}


start_chain();


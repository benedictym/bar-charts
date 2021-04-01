class Ellipse {
    constructor(radiusY, radiusX) {
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }

    // taken from Will
    // checks to see if coordinates
    is_legal() {
        return (!(this.radiusX <= 0 || this.radiusX > 150) && !(this.radiusY <= 0 || this.radiusY > 150));
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
        return("Radius X: " + this.radiusX.toString() + " Radius Y: " + this.radiusY.toString());
    }
}

// taken from Will
class Chain{
    constructor(chain_no) {
        this.chain_no = chain_no;
    }
    selected_ellipses = [];

    add_results(ellipse) {
        this.selected_ellipses.push(ellipse);
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
const chains = [new Chain(0), new Chain(1), new Chain(2)];
const buttons = document.querySelectorAll('button');

function random_box_muller(){
    let u = 0;
    let v = 0;
    while (u===0) {
        u = Math.random();
    }
    while (v===0){
        v = Math.random();
    }
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function normalSkewed(mean, sd, skew){
    let u = 0;
    let v = 0;
    while (u===0) {
        u = Math.random();
    }
    while (v===0){
        v = Math.random();
    }
    const R = Math.sqrt(-2.0*Math.log(u));
    const pheta = 2.0* Math.PI * v;
    [u0, u1] = [R * Math.cos(pheta),R* Math.sin(pheta)];
    if (skew === 0) {
        r
    }
}
function change(chain) {
let current_ellipse;
let new_ellipse;
let side;

    function redraw(chain){
        let current_ellipse = chain.state();
        let new_ellipse;
        let side = Math.round(Math.random());

        if (current_ellipse == null) {
            current_ellipse = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1));
            new_ellipse = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1));
        } else{
            let sd_radiusX = current_ellipse.radiusX * 0.7;
            let sd_radiusY = current_ellipse.radiusY * 0.7;
            let mean_radiusX = current_ellipse.radiusX;
            let mean_radiusY = current_ellipse.radiusY;


            function getSample(){
                let gaussian_sample = random_box_muller();
                let new_radiusX = Math.floor(sd_radiusX * gaussian_sample + mean_radiusX);
                let new_radiusY = Math.floor(sd_radiusY * gaussian_sample + mean_radiusY);
                return new_ellipse = new Ellipse(new_radiusY, new_radiusX);
            }
            new_ellipse = getSample();

            while (!new_ellipse.is_legal() || (new_ellipse === current_ellipse)) {
                new_ellipse = getSample();
            }
        }
        // if you get side 0 draw on left side
        if (side === 0) {
            current_ellipse.draw_ellipse(l_canvas);
            new_ellipse.draw_ellipse(r_canvas);
        } else {
            current_ellipse.draw_ellipse(r_canvas);
            new_ellipse.draw_ellipse(l_canvas);
        }
        return [current_ellipse, new_ellipse, side];
    }

    [current_ellipse, new_ellipse, side] = redraw(chain);

    return new Promise(resolve => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function () {
                console.log(chain.print_chain());
                if ((buttons[i].id === 'left' && side === 0) || (buttons[i].id === 'right' && side === 1)) {
                    console.log(current_ellipse.toString());
                    chain.add_results(current_ellipse);
                    [current_ellipse, new_ellipse, side] = redraw(chain);
                }else{
                    console.log(new_ellipse.toString());
                    chain.add_results(new_ellipse);
                    [current_ellipse, new_ellipse, side] = redraw(chain);
                }
                resolve(chain);
                }
        }
    })
}

async function start_chain(chains) {
    let i = 0;
    while (i<100){
        let chain_no = i % 3;
        await change(chains[chain_no]);
        i++;
    }
}

start_chain(chains);

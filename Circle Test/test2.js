class Ellipse {
    constructor(lightness, chromatic_a, chromatic_b) {
        this.lightness = lightness;
        this.chromatic_a = ch;
    }

    // taken from Will
    // checks to see if coordinates
    is_legal() {
        return (!(this.radiusX < 0 || this.radiusX > 350) && !(this.radiusY < 0 || this.radiusY > 350));
    }

    draw_ellipse(canvas) {
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
        return("RadiusX: " + Math.round(this.radiusX).toString() + " " + "RadiusY: " + Math.round(this.radiusY).toString());
    }
}

// taken from Will
class Chain {
    selected_ellipses = [];

    add_results(radiusX, radiusY) {
        this.selected_ellipses.push([new Ellipse(radiusX, radiusY)]);
    }

    state() {
        if (this.selected_ellipses.length === 0) {
            return null;
        } else {
            return this.selected_ellipses[this.selected_ellipses.length - 1];
        }
    }
}

var chain1 = new Chain();
var chain2 = new Chain();
var chain3 = new Chain();

let [l_canvas,r_canvas] = document.querySelectorAll('canvas');

// let left_canvas = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1), canvas[0]);
// let right_canvas = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1), canvas[1]);
// left_canvas.draw_ellipse();
// right_canvas.draw_ellipse();

async function change(chain) {

    //taken from Will
    let old_ellipse = chain.state();
    let new_ellipse = null;
    // 0 is left side, 1 is right
    let side = Math.round(Math.random());

    // taken from Will
    if (old_ellipse == null) {
        old_ellipse = new Ellipse(Math.random() * 150, Math.random() * 150);
        new_ellipse = new Ellipse(Math.random() * 150, Math.random() * 150);
        if(side === 0) {
            old_ellipse.draw_ellipse(l_canvas);
            new_ellipse.draw_ellipse(r_canvas);
        } else {
            old_ellipse.draw_ellipse(r_canvas);
            new_ellipse.draw_ellipse(l_canvas);
        }
    } else {
        new_ellipse = new Ellipse(Math.random() * 150, Math.random() * 150);
        while (!new_ellipse.is_legal()) {
            new_ellipse = new Ellipse(Math.random() * 150, Math.random() * 150);
        }
    }

    // let side = Math.round(Math.random());
    // //0 is left side, 1 is right side
    // if (side === 0) {
    //     old_ellipse.draw_ellipse(canvas[0]);
    //     new_ellipse.draw_ellipse(canvas[1]);
    // } else {
    //     new_ellipse.draw_ellipse(canvas[0]);
    //     old_ellipse.draw_ellipse(canvas[1]);
    // }

    let buttons = document.querySelectorAll('button');
    let click_promises = []
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener()
    }
    // click_promises.push(new Promise((resolve, reject) => {
    //     buttons[i].addEventListener("click", function () {
    //         if (buttons[i].id === 'left') {
    //             chain.selected_ellipses.push(old_ellipse);
    //             if (side === 0) {
    //                 new_ellipse.draw_ellipse(r_canvas);
    //             } else{
    //                 old_ellipse.draw_ellipse(r_canvas);
    //                 new_ellipse.draw_ellipse(l_canvas);
    //             }
    //         } else {
    //             if (side === 1) {
    //                 new_ellipse.draw_ellipse(l_canvas);
    //             } else {
    //                 old_ellipse.draw_ellipse(l_canvas);
    //                 new_ellipse.draw_ellipse(r_canvas);
    //             }
    //         }
    //         resolve(buttons.id);
    //         });
    //     }))
    // }
    console.log(chain);
    console.log(chain.selected_ellipses);

    await Promise.any(click_promises);

    // buttons[i].addEventListener("click", function () {
    //     // 0 means "good eclipse" goes to left side
    //     // 1 means it goes to the right side
    //     let side = Math.round(Math.random());
    //     if (buttons[i].id === 'left') {
    //         selected_ellipses.push([left_canvas.radiusX, left_canvas.radiusY]);
    //         if (side === 0) {
    //             right_canvas.radiusX = ((Math.random() * 150) + 1);
    //             right_canvas.radiusY = ((Math.random() * 150) + 1);
    //             right_canvas.draw_ellipse();
    //         } else {
    //             right_canvas.radiusX = left_canvas.radiusX;
    //             right_canvas.radiusY = left_canvas.radiusY;
    //             right_canvas.draw_ellipse();
    //             left_canvas.radiusX = ((Math.random() * 150) + 1);
    //             left_canvas.radiusY = ((Math.random() * 150) + 1);
    //             left_canvas.draw_ellipse();
    //         }
    //     } else {
    //         selected_ellipses.push([right_canvas.radiusX, right_canvas.radiusY]);
    //         if (side === 1) {
    //             left_canvas.radiusX = ((Math.random() * 150) + 1);
    //             left_canvas.radiusY = ((Math.random() * 150) + 1);
    //             left_canvas.draw_ellipse();
    //         } else {
    //             left_canvas.radiusX = right_canvas.radiusX;
    //             left_canvas.radiusY = right_canvas.radiusY;
    //             left_canvas.draw_ellipse();
    //             right_canvas.radiusX = ((Math.random() * 150) + 1);
    //             right_canvas.radiusY = ((Math.random() * 150) + 1);
    //             right_canvas.draw_ellipse();
    //         }
    //
    //     }
    //
    //     console.log(selected_ellipses);
    //     console.log(side);
    // }
}

(async () => {
    let i = 0;
    while (i < 2000) {
        // chains = [chain1, chain2, chain3];
        // await change(chains[i%3]);
        await change(chain1);
        await change(chain2);
        await change(chain3);
        // console.log((i%3).toString() + ": " + chains[i%3].state().toString() + " Chain length: " + chains[i%3].selected_ellipses.length.toString());
        console.log('1: ' + chain1.state().toString() + " " + "Chain length: " + chain1.selected_ellipses.length.toString());
        console.log('2: ' + chain2.state().toString() + " " + "Chain length: " + chain2.selected_ellipses.length.toString());
        console.log('3: ' + chain3.state().toString() + " " + "Chain length: " + chain3.selected_ellipses.length.toString());
        i++;
    }
}) ();
// for (let i=0; i < chains.length; i++) {
//     sleep(5000);
//     chains[i].left_canvas.draw_ellipse();
//     sleep(2000);
//     chains[i].right_canvas.draw_ellipse();
//     change(chains[i]);
//     sleep(2000);
// }

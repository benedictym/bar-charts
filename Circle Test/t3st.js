class Ellipse {
    constructor(radiusX, radiusY, canvas) {
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.canvas = canvas;
    }

    // taken from Will
    // checks to see if coordinates
    is_legal() {
        return (!(this.radiusX < 0 || this.radiusX > 350) && !(this.radiusY < 0 || this.radiusY > 350));
    }

    draw_ellipse() {
        let ctx = this.canvas.getContext('2d');
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
class Chain {
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
}

var chain1 = new Chain();
var chain2 = new Chain();
var chain3 = new Chain();

let canvas = document.querySelectorAll('canvas');
let left_canvas = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1), canvas[0]);
let right_canvas = new Ellipse(Math.floor(Math.random() * 150 + 1), Math.floor(Math.random() * 150 + 1), canvas[1]);


left_canvas.draw_ellipse();
right_canvas.draw_ellipse();


let selected_ellipses = []
let buttons = document.querySelectorAll('button');
function change() {

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            // 0 means "good eclipse" goes to left side
            // 1 means it goes to the right side
            let side = Math.round(Math.random());
            if (buttons[i].id === 'left') {
                selected_ellipses.push([left_canvas.radiusX, left_canvas.radiusY]);
                if (side === 0) {
                    right_canvas.radiusX = ((Math.random() * 150) + 1);
                    right_canvas.radiusY = ((Math.random() * 150) + 1);
                    right_canvas.draw_ellipse();
                } else {
                    right_canvas.radiusX = left_canvas.radiusX;
                    right_canvas.radiusY = left_canvas.radiusY;
                    right_canvas.draw_ellipse();
                    left_canvas.radiusX = ((Math.random() * 150) + 1);
                    left_canvas.radiusY = ((Math.random() * 150) + 1);
                    left_canvas.draw_ellipse();
                }
            } else {
                selected_ellipses.push([right_canvas.radiusX, right_canvas.radiusY]);
                if (side === 1) {
                    left_canvas.radiusX = ((Math.random() * 150) + 1);
                    left_canvas.radiusY = ((Math.random() * 150) + 1);
                    left_canvas.draw_ellipse();
                } else {
                    left_canvas.radiusX = right_canvas.radiusX;
                    left_canvas.radiusY = right_canvas.radiusY;
                    left_canvas.draw_ellipse();
                    right_canvas.radiusX = ((Math.random() * 150) + 1);
                    right_canvas.radiusY = ((Math.random() * 150) + 1);
                    right_canvas.draw_ellipse();
                }

            }

            console.log(selected_ellipses);
            console.log(side);
        })
    }
}

change();
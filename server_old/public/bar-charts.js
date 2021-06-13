export class BarChart {
    constructor(lightness, chromatic_a, chromatic_b) {
        this.lightness = lightness;
        this.chromatic_a = chromatic_a;
        this.chromatic_b = chromatic_b;
        this.rechosen = false;
        this.no_rejections = 0;
        this.rejectionReason = [];
        this.no_bars = lightness.length;
    }

    // taken from Will
    // checks to see if coordinates
    is_legal() {
        const lightness_check = (el) => (el >= 15 && el <= 90);
        const chromaticA_check = (el) => (el >= -86.185 && el <= 96.254);
        const chromaticB_check = (el) => (el >= -107.863 && el <= 84.482);
        return (this.lightness.every(lightness_check) && this.chromatic_a.every(chromaticA_check) && this.chromatic_b.every(chromaticB_check));
    }

    legal_light(){
        const lightness_check = (el) => (el >= 15 && el <= 90);
        return(this.lightness.every(lightness_check));
    }

    legal_chromA(){
        const chromaticA_check = (el) => (el >= -86.185 && el <= 96.254);
        return(this.chromatic_a.every(chromaticA_check));
    }

    legal_chromB(){
        const chromaticB_check = (el) => (el >= -107.863 && el <= 84.482);
        return(this.chromatic_b.every(chromaticB_check));
    }
    convert_lab_rgb(l, a, b, opacity = 0.6){
        let rgba_array = []
        for (let i = 0; i < l.length; i++) {
            let lab_val = d3.lab(l[i],a[i],b[i]);
            let rgb_val = lab_val.rgb();
            let r_val = rgb_val['r'].toString();
            let g_val = rgb_val['g'].toString();
            let b_val = rgb_val['b'].toString();
            let rgba = "\nrgba(" + r_val + "," + g_val + "," + b_val + "," + opacity.toString() + ")";
            rgba_array.push(rgba);
        }
        return rgba_array;
    }

    draw_chart(canvas) {
        const bar_heights = [10, 20, 15, 6, 12, 18];
        const bars_used = bar_heights.slice(0, this.no_bars);
        const title = ['A', 'B', 'C', 'D', 'E', 'F'];
        const title_used = title.slice(0, this.no_bars);
        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: title_used,
                    datasets: [{
                        data: bars_used,
                        backgroundColor: this.convert_lab_rgb(this.lightness, this.chromatic_a, this.chromatic_b),
                        borderColor: this.convert_lab_rgb(this.lightness, this.chromatic_a, this.chromatic_b,1),
                        borderWidth: 1

                    }]
                },
                options: {
                    // removes labels on graph
                    legend: {display: false},
                    scales: {
                        xAxes: [{
                            // removes axis label
                            ticks: {display:false},
                            // removes minor gridlines
                            gridLines: {drawOnChartArea: false}
                        }],
                        yAxes:[{
                            ticks: {
                                display: false,
                                beginAtZero: true
                            },
                            gridLines: {drawOnChartArea: false}
                        }]
                    },
                    // removes information over hover
                    tooltips: {enabled: false},
                    events: ['click'],
                    hover: {mode: null},
                    animation: {
                        duration: 600
                    }
                }
            }
        );
    }

    // taken from Will
    // not sure if I will use it yet
    toString(){
        const round_l = this.lightness.map(function (el) {
            return " " + el.toFixed(2);
        });
        const round_a = this.chromatic_a.map(function (el){
            return " " + el.toFixed(2);
        });
        const round_b = this.chromatic_b.map(function (el){
            return " " + el.toFixed(2);
        });
        return("L*: " + round_l + "\nA*: " + round_a + "\nB*: " + round_b);
    }
}

export class Chain{
    constructor(chain_no) {
        this.chain_no = chain_no;
        this.selected_colours = [];
    }

    add_results(bar_charts) {
        this.selected_colours.push(bar_charts);
    }

    state() {
        if (this.selected_colours.length === 0) {
            return null;
        } else {
            return this.selected_colours[this.selected_colours.length - 1];
        }
    }

    print_chain(){
        return("chain no.: " + this.chain_no.toString() + "\nChain length: " + this.selected_colours.length.toString());
    }
}

const [l_canvas, r_canvas] = document.querySelectorAll('canvas');
const buttons = document.querySelectorAll('button');

// left is 0
// right is 1
let sides = "";
let session_chains = {};

function change(chain) {
    let current_chart;
    let new_chart;
    let side;
    // let chain_no = chain.chain_no;

    function redraw(chain){
        let chain_no  = chain.chain_no;
        let current_chart = chain.state();
        let new_chart;
        let side = Math.round(Math.random());

        // generates array with no bars needed, with range needed
        function generate_RandArray(max, min, no_bars=5){
            let lab_array = [];
            for (let i = 0; i<no_bars; i++){
                let rand_val = (Math.random()*(max-min))+min;
                lab_array.push(rand_val);
            }
            return lab_array;
        }

        let randomBoxMuller = () => {
            let u1=0, u2=0;
            while (u1===0) u1 = Math.random();
            while (u2===0) u2 = Math.random();
            const R = Math.sqrt(-2.0 * Math.log(u1));
            const pheta = 2.0 * Math.PI * u2;
            return [R * Math.cos(pheta), R * Math.sin(pheta)];
        }

        let randomSkewNormal = (mean, sd, a=0) => {
            const [u0, v] = randomBoxMuller();
            if(a===0) {
                return mean + sd * u0;
            }
            const delta = a / Math.sqrt(1 + a * a);
            const u1 = delta * u0 + Math.sqrt(1 - delta * delta) * v;
            const z = u0 >= 0 ? u1 : -u1;
            return mean + sd * z;
        }

        if (current_chart == null) {
            let hue_range;
            let light_vals;
            let a_vals;
            let b_vals;

            // generate initial charts
            function generate_colours(hue_range, no_bars = 5, saturated = true, light = true) {
                const [hue_min, hue_max] = hue_range
                let light_values;
                let rand_a;
                let rand_b;
                let a_values = [];
                let b_values = [];
                let check;

                light_values = (light ? generate_RandArray(90, 52.5) : generate_RandArray(52.5, 15));

                function generate_hue() {
                    // failed chroma experimentt
                    // if(saturated === true){
                    //     rand_a = (Math.random() * (96.254 + 86.185)) - 86.185;
                    //     rand_b = (Math.random() * (84.482 + 107.863)) - 107.863;
                    //     chroma = Math.sqrt(Math.pow(rand_a, 2) + Math.pow(rand_b,2));
                    //     // max chroma = 114.5657611
                    //     while(chroma < 114.5657611){
                    //         rand_a = (Math.random() * (96.254 + 86.185)) - 86.185;
                    //         rand_b = (Math.random() * (84.482 + 107.863)) - 107.863;
                    //         chroma = Math.sqrt(Math.pow(rand_a, 2) + Math.pow(rand_b,2));
                    //     }
                    //
                    // } else{
                    rand_a = (Math.random() * (96.254 + 86.185)) - 86.185;
                    rand_b = (Math.random() * (84.482 + 107.863)) - 107.863;
                    // }
                    return [rand_a, rand_b]
                }

                for (let i = 0; i <= no_bars; i++) {

                    function check_hue() {
                        [rand_a, rand_b] = generate_hue();
                        let arctan = Math.atan((rand_b / rand_a));

                        if (arctan < 0) {
                            (rand_a < 0) ? arctan += Math.PI : arctan += 2 * Math.PI;
                        } else if (rand_a < 0) {
                            arctan += Math.PI;
                        }

                        let arctan_deg = arctan * (180 / Math.PI);

                        if (hue_min < hue_max) {
                            check = (arctan_deg < hue_min) || (arctan_deg > hue_max);
                        } else {
                            check = (arctan_deg > hue_max && arctan_deg < hue_min);
                        }
                    }

                    check_hue();

                    while (check) {
                        check_hue();
                    }

                    a_values.push(rand_a);
                    b_values.push(rand_b);
                }

                return [light_values, a_values, b_values];
            }

            switch (chain_no){
                case 0:
                    current_chart = new BarChart(generate_RandArray(90, 15), generate_RandArray(96.254, -86.185), generate_RandArray( 84.482, -107.863));
                    break;
                case 1:
                    // green hues
                    hue_range = [115, 225];
                    [light_vals,a_vals,b_vals] = generate_colours(hue_range);
                    current_chart = new BarChart(light_vals, a_vals, b_vals);
                    break;
                case 2:
                    // blue hues
                    hue_range = [210, 320];
                    [light_vals, a_vals, b_vals] = generate_colours(hue_range);
                    current_chart = new BarChart(light_vals, a_vals, b_vals);
                    break;
                case 3:
                    // purple hues
                    hue_range = [270, 20];
                    [light_vals, a_vals, b_vals] = generate_colours(hue_range);
                    current_chart = new BarChart(light_vals, a_vals, b_vals);
                    break;
                case 4:
                    // red hues
                    hue_range = [315, 65];
                    [light_vals, a_vals, b_vals] = generate_colours(hue_range);
                    current_chart = new BarChart(light_vals, a_vals, b_vals);
                    break;
            }
            new_chart = new BarChart(generate_RandArray(90, 15), generate_RandArray(96.254, -86.185), generate_RandArray(84.482, -107.863));
        } else{
            let sd_lightness = current_chart.lightness.map(function (element){
                // return element * 2;
                return 18.75;
            });
            let sd_chromaticA = current_chart.chromatic_a.map(function (element) {
                // return element * 2;
                return 45.61;
            });
            let sd_chromaticB = current_chart.chromatic_b.map(function (element){
                // return element * 2;
                return 48.09;
            });
            let mean_lightness = current_chart.lightness
            let mean_chromaticA = current_chart.chromatic_a;
            let mean_chromaticB = current_chart.chromatic_b;

            function getSample(){
                let new_chart;
                let a = () => {
                    let proposal = Math.round(Math.random())
                    return (proposal === 0) ? -4 : 4;
                    // return (proposal === 0) ? -5 : 5;
                    // return 0;

                }
                let new_lightness = [];
                let new_chromaticA = [];
                let new_chromaticB = [];

                for(let i=0; i<current_chart.no_bars; i++){
                    let lightness = randomSkewNormal(mean_lightness[i], sd_lightness[i], a());
                    new_lightness.push(lightness);
                    let chromaticA = randomSkewNormal(mean_chromaticA[i], sd_chromaticA[i], a());
                    new_chromaticA.push(chromaticA);
                    let chromaticB = randomSkewNormal(mean_chromaticB[i], sd_chromaticB[i], a());
                    new_chromaticB.push(chromaticB);
                }

                const randomise = Math.random();
                if (randomise < 0.1) {
                    const rand_parameter = Math.random();
                    if (rand_parameter < 1 / 3) {
                        new_lightness = generate_RandArray( 90, 15);
                    } else if (1 / 3 <= rand_parameter < 2 / 3) {
                        new_chromaticA = generate_RandArray(96.254, -86.185);
                    } else if (rand_parameter <= 2 / 3) {
                        new_chromaticB = generate_RandArray(84.482, -107.863);
                    }
                }
                new_chart = new BarChart(new_lightness, new_chromaticA, new_chromaticB);
                return new_chart;
            }
            new_chart = getSample();
            //
            while (!new_chart.is_legal() || new_chart === current_chart){
                current_chart.no_rejections = current_chart.no_rejections + 1;
                let out_of_bounds = [];
                if(!new_chart.legal_light()){
                    out_of_bounds.push("l");
                }
                if(!new_chart.legal_chromA()){
                    out_of_bounds.push("a");
                }
                if(!new_chart.legal_chromB()){
                    out_of_bounds.push("b")
                }

                current_chart.rejectionReason.push(out_of_bounds);

                new_chart = getSample();
            }
        }

        // if you get side 0 draw on left side
        if (side === 0) {
            current_chart.draw_chart(l_canvas);
            new_chart.draw_chart(r_canvas);
        } else {
            current_chart.draw_chart(r_canvas);
            new_chart.draw_chart(l_canvas);
        }
        return [current_chart, new_chart, side];
    }

    [current_chart, new_chart, side] = redraw(chain);

    return new Promise(resolve => {
        function keep_current(){
            console.log(current_chart.toString());
            current_chart.rechosen = true;
            let current_chart_added = new BarChart(current_chart.lightness, current_chart.chromatic_a, current_chart.chromatic_b);
            chain.add_results(current_chart_added);
            [current_chart, new_chart, side] = redraw(chain);
        }
        function change_current(){
            console.log(new_chart.toString());
            current_chart.rechosen = false;
            let new_chart_added = new BarChart(new_chart.lightness, new_chart.chromatic_a, new_chart.chromatic_b);
            chain.add_results(new_chart_added);
            [current_chart, new_chart, side] = redraw(chain);
        }
        document.body.onkeydown = function (e) {
            console.log(chain.print_chain());
            // checks which side users is pressing
            if(e.key === 'ArrowLeft'){
                sides += 0;
            } else if (e.key === 'ArrowRight'){
                sides += 1;
            }

            if((e.key === 'ArrowLeft' && side === 0) || (e.key === 'ArrowRight' && side === 1)){
                keep_current();
            } else {
                change_current();
            }

            resolve(chain);
        }

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function () {
                console.log(chain.print_chain());

                if(buttons[i].id === 'left'){
                    sides += 0;
                } else if(buttons[i].id === 'right') {
                    sides += 1;
                }

                if ((buttons[i].id === 'left' && side === 0) || (buttons[i].id === 'right' && side === 1)) {
                    keep_current();
                }else{
                    change_current();
                }
                resolve(chain);
            }
        }
    })
}

function gelman_rubin (chains, bar_parameter){
    // M = chain length
    let M = chains.length;
    // length of longest chain
    let N = Math.floor(chains[0].selected_colours.length/2);
    let posterior_means = [];
    let intraChain_variances = [];
    chains.forEach(chain => {
        let bar_parameters = []
        // discard the burn-in (the first n parameters of a chain length 2n)
        bar_parameters = bar_parameters.slice(Math.floor(N/2));
        // get all the parameters for the chain
        switch (bar_parameter) {
            case 'lightness':
                chain.selected_colours.forEach(colour=> bar_parameters = colour.lightness);
                break;
            case 'chromatic_a':
                chain.selected_colours.forEach(colour=> bar_parameters = colour.chromatic_a);
                break;
            case 'chromatic_b':
                chain.selected_colours.forEach(colour=> bar_parameters = colour.chromatic_b);
                break;
        }

        let sum_params = bar_parameters.reduce((total, current_param) => total + current_param, 0);
        let posterior_mean = (bar_parameters.length !== 0) ? (1/bar_parameters.length) * sum_params : 0
        posterior_means.push(posterior_mean);
        let var_params = bar_parameters.reduce((total, current) =>
            total + Math.pow(current - posterior_mean,2), 0);
        let intraChain_variance = (bar_parameters.length !== 0) ? (1/(bar_parameters.length - 1)) * var_params : 0;
        intraChain_variances.push(intraChain_variance);
    })
    let x_mean = (1/M) * (posterior_means.reduce((total_mean, current_mean) => total_mean + current_mean, 0));
    // how the individual means vary around the joint mean
    let B = (N/(M-1)) * (posterior_means.reduce((total_b, current_b) => total_b + Math.pow(current_b - x_mean, 2), 0));
    // averaged variances of the chains
    let W = (1/M) * (intraChain_variances.reduce((total_var, current_var) => total_var + current_var, 0));
    let sigma_sq = ((N-1)/N)*W + (1/N)*B;
    let V = sigma_sq + (B/(M*N));
    // calculating degrees of freedom
    let si_mean = (1/M) * intraChain_variances.reduce((total_val, current_val) => total_val + current_val, 0);
    let si_var = (1/M-1) * intraChain_variances.reduce((total_var, current_var) => total_var + Math.pow((current_var - si_mean), 2), 0);
    let cov = (a, a_mean, b, b_mean) => {
        let sum = 0;
        const len = a.length
        for(let i=0; i < len; i++){
            sum = sum + (a[i] - a_mean) * (b[i] - b_mean);
        }
        return sum/len-1;
    }
    let chain_squared = posterior_means.map(e => Math.pow(e,2));
    let chain_squared_mean = (1/M) * chain_squared.reduce((total, current) => total + current);
    let var_V =Math.pow((N-1)/N,2) * (1/M) * si_var +
       Math.pow((M+1)/(M*N),2) * (2/(M-1)) * Math.pow(B,2) +
        2*(((M+1)*(N-1))/M*Math.pow(N,2)) *
        (N/M) * (cov(intraChain_variances, si_mean, chain_squared, chain_squared_mean) - 2*x_mean*cov(intraChain_variances, si_mean, posterior_means, x_mean));
    let d = 2*V / var_V;
    // let R = Math.sqrt((V/W));
    let R = Math.sqrt((V/W) * ((d+3)/(d+1)));
    // let R = Math.sqrt((N-1)/N + ((M+1)/(M*N))*(B/W));
    console.log('For the parameter: ' + bar_parameter + ' R is: ' + R.toString());
    return R;
}

export async function start_chain(chains, current_lineage, cookie) {

    const postLineage = async (lineage_json, server_url) => {
        const settings = {
            headers: {'Content-Type': "application/json"},
            method: 'POST',
            body: lineage_json
        }

        await fetch( server_url, settings);

    }
    let lineage_json = ()=> {
        if(chains[0].selected_colours.length >= 100) {
            const lightness = gelman_rubin(chains, 'lightness');
            const chromatic_a = gelman_rubin(chains, 'chromatic_a');
            const chromatic_b = gelman_rubin(chains, 'chromatic_b');

            // checks if lineage has converged
            if(((lightness < 1.2) && (chromatic_a < 1.2) && (chromatic_b < 1.2)) || chains[0].selected_colours.length >= 6000) {
                current_lineage.occupied = "converged";
            } else {
                current_lineage.occupied = "false";
            }
            current_lineage["gelmanRubin"] = {
                lightness: gelman_rubin(chains, 'lightness'),
                chromatic_a: gelman_rubin(chains, 'chromatic_a'),
                chromatic_b: gelman_rubin(chains, 'chromatic_b')
            }
        } else {
            current_lineage["gelmanRubin"] = "not a long enough chain";
        }

        // checks at least 10 charts chosen
        if(i < 10) {valid = false;}

        current_lineage["valid"] = valid;
        current_lineage.chains = chains;
        current_lineage["cookie"] = cookie;
        current_lineage["sides"] = sides;
        current_lineage["no_choices"] = sides.length;
        current_lineage["session_len"] = session_chains;
        return JSON.stringify(current_lineage);
    }

    let valid = true;
    const total = 1500;

    window.addEventListener("beforeunload", async (e) => {
        const lineageJson = JSON.stringify({
            lineage_id: current_lineage.lineage_id
        });
        try{
            await postLineage(lineageJson, "/task/occupied");
        }catch (e) {
            console.log("promise rejection error with updating occupied status");
            console.error(e);
        }

    });

    let i = 0;
    while (i < total){
        let chain_no = i % chains.length;
        let amount_left = total - i;
        document.getElementById('amount_left').innerHTML = "Choices left: " + "<b>" + amount_left.toString() + "</b>";
        try{
            await change(chains[chain_no]);
        } catch (e) {
            console.log("chain promise error: ",e)
        }
        if(((i+1) % 500) === 0){
            let lineageJson = lineage_json();
            try{
                postLineage(lineageJson, "/task/json");
            } catch (e) {
                console.log("promise error with posting lineage");
                console.error(e);
            }
        }

        if(chains[chain_no].selected_colours.length >= 6000){
            valid = true;
            break;
        }

        if(!session_chains.hasOwnProperty(chain_no)){
            session_chains[chain_no] = 1;
        } else {
            let chain_len = session_chains[chain_no];
            session_chains[chain_no] = chain_len + 1;
        }

        let all_left = /(0){13}/.test(sides);
        let all_right = /(1){13}/.test(sides);
        let alternate = /(01){7}/.test(sides);
        if(all_left || all_right || alternate){
            valid = false;
            break;
        }
        i++;
    }

    window.location.href = "/exit";

}



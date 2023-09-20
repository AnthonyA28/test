---
title: Arrhenious Plot
layout: article_post
section: article
excerpt: Creating an Arrhenious plot to determine the activation energy of a reaction.
tags: ChemicalEngineering
---


# Arrhenious Plot
Input experimental temperature and corresponding reaction rate constants. After clicking submit, a plot will be shown and the Activation Energy and pre-exponential constants will be shown. Using R = 8.31446  $\frac{J}{K mol}$, so use T in Kelvin.

<form action="#" onsubmit="update_params();return false">
    <!-- Phi: <input type="text" id="phi_id" value ="0.95"><br> -->
    <!-- standard deviation: <input type="text" id="standard_deviation_id" value ="1.0"><br> -->
    <!-- Sample period (ms) : <input type="text" id="samplePeriod_id" value = "100"><br> -->
    Input The K values in the left box, and the corresponding T values in the right box. Seperate each term by a comma.
    <br>
    K : <input type="text" id="Ks_id" value = "">
    T : <input type="text" id="Ts_id" value = ""> <input type="submit">
    
</form>
<table style="height: 30px; width: 600px; float: left;">
<tbody>
<tr>
<td style="width: 302px;">Activation Energy: <output id="E_a"></output> J/mol</td>
<td style="width: 275px;">Pre-exponentail Factor: <output id="A"></output></td>
</tr>
</tbody>
</table>



<canvas id="chart" class="chartjs" width="300px" height="150px"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"></script>

<script>


function findLineByLeastSquares(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;

    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    /*
     * Nothing to do.
     */
    if (values_length === 0) {
        return [ [], [] ];
    }

    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = values_y[v];
        sum_x += x;
        sum_y += y;
        sum_xx += x*x;
        sum_xy += x*y;
        count++;
    }

    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;

    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];

    for (var v = 0; v < values_length; v++) {
        x = values_x[v];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [m , b];
}




function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
}

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//       dataset.data.push(data);
//     });
//     chart.update();
// }
//

function transpose_to_object(x, y){
    let obj = [];
    for(let i = 0; i < x.length; i ++) {
        let pair = {x: x[i], y: y[i]};
        obj.push(pair);
    }
    return obj
}

function plotArrhenious(){


    
    K.forEach(function(elem, i, self){
        self[i] = elem*(10**(-5));
    });

    var lnK = []
    K.forEach(function(elem, i, a){
        lnK[i] = Math.log(elem);
    });

    var oneOverT = []
    T.forEach(function(elem, i, a){
        oneOverT[i] = 1/elem;
    });


    // 
    let result = findLineByLeastSquares(oneOverT, lnK)
    let m = result[0];
    let b = result[1];

    let theo_lnK = [];
    let theo_oneOverT = []
    let dataset_length = 100;
    theo_oneOverT[0] = 0.0;
    theo_oneOverT[dataset_length-1] = Math.max(...oneOverT);
    let delOneOverT = (theo_oneOverT[dataset_length-1]-theo_oneOverT[0] )/dataset_length

    let i = 0
    theo_lnK[i] = m*theo_oneOverT[i] + b;
    i += 1;
    while(i<dataset_length){
        theo_oneOverT[i] = theo_oneOverT[i-1] + delOneOverT
        theo_lnK[i] = m*theo_oneOverT[i] + b;
        // addData(chart, theo_oneOverT[i], theo_lnK[i])
        i += 1
    }
    
    let theo = transpose_to_object(theo_oneOverT, theo_lnK)
    let exp = transpose_to_object(oneOverT, lnK)
    exp.sort();
    
    var chart = new Chart(document.getElementById("chart"),
        {"type":"scatter",
            "data":{
                datasets:[
                    {
                        label: 'Fitted Line',
                        data: theo,
                        showLine: true,
                        fill: false,
                        "borderColor":"rgb(255, 0, 0,1)",
                        pointRadius: 1
                    },
                    {
                        label: 'Experimental',
                        data: exp,
                        showLine: true,
                        fill: false,
                        borderColor: 'rgba(0, 0, 255, 0.3)',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                tooltips: {
                  mode: 'index',
                  intersect: false,
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  yAxes: [{
                    scaleLabel:{
                        display: true,
                        labelString: "ln(K)"
                    },
                    ticks: {
                      beginAtZero:true
                    }
                  }],
                  xAxes:[{
                    scaleLabel:{
                        display: true,
                        labelString: "1/T"
                    },
                  }]
                },
              }
                
        }
    );

    

    let R = 8.31446 // J K−1  mol−1, wikipeddia
    // m = E_1/R
    E_a = -R * m 
    console.log("E_a = ", E_a)
    // b = ln(A) 
    A = Math.exp(b)
    console.log("A = ", A)
    document.getElementById("E_a").innerHTML = E_a
    document.getElementById("A").innerHTML = A

}




// Arrhenious equation 
// K = A exp(-E_a/RT) , R = 8.31446 J K−1  mol−1
// ln(K) = ln(A) - E_a/R(1/T)
// y = ln(A), x = 1/T


var T = [273, 298, 308, 318, 328, 338] // (Kelvin)
var K = [0.0787, 3.46, 13.5, 49.8, 150, 487] // (10^5/s)

function update_params(){
    let input = document.getElementById("Ks_id").value; 
    input = "[" + input + "]";
    K = JSON.parse(input);

    input = document.getElementById("Ts_id").value; 
    input = "[" + input + "]";
    T = JSON.parse(input);

    if (K.length != T.length ){
        alert("Not the same number of values of K and T ")
    }
    plotArrhenious()
}

</script>
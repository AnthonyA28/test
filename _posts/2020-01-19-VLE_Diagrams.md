---
title: VLE Diagram Generator
layout: article_post
section: article
excerpt: Generate an XY and T-XY chart from Antoine equation constants.
tags: ChemicalEngineering
---

# VLE Diagram

<form action="#xychart" onsubmit="submitted();">


<table style="height: 46px; width: 507px;">
<tbody>
    This is an ideal XY and T-XY VLE diagram calculator using Antoines equation.
    Use the Antoine's constants that will correspond to a pressure in mmHg and T in Celsius. (The logarithm is base 10.)
<tr>
<td >&nbsp;
    <h2> MVC
    </h2>
    (more volatile component):<br>
    <p>
        <!-- Ethanol from wikipedia -->
        A: <input type="text" id="MVC_A" value="7.68117 "><br>
        B: <input type="text" id="MVC_B" value="1332.04 "><br>
        C: <input type="text" id="MVC_C" value="199.200"><br>
    </p>
</td>
<td >&nbsp;
   <h2> LVC: <br>
    </h2>
    <p >
        <!-- Water from wikipedia -->
        A: <input type="text" id="LVC_A" value="8.07131"><br>
        B: <input type="text" id="LVC_B" value="1730.63"><br>
        C: <input type="text" id="LVC_C" value="233.426"><br>
    </p>

</td>
<td>&nbsp;
    <p >
        Temperature interval between datapoints: <input type="text" id="step" value="1"><br>
        P total [mmHg]: <input type="text" id="P_total" value="760"><br>
    </p>
</td>

</tr>
</tbody>
</table>
<input type="submit">
</form>


<tbody>
<tr>
<td >&nbsp;
    <canvas id="xychart" class="chartjs" ></canvas>
    <br/>
    <br/>
    <canvas id="Txychart" class="chartjs" ></canvas>
</td>
</tr>
</tbody>


<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<script type="text/javascript">



var xypoints = [];
let xychart = new Chart(document.getElementById("xychart"), {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'Composition_MVC',
            data: xypoints,
            fill: false,
            pointBackgroundColor: 'rgba(0, 0, 255, 0.5)',
            pointBorderColor: 'rgba(0, 0, 255, 0)',
            backgroundColor: 'rgba(0, 0, 255, 1)',
            borderColor: 'rgba(0, 0, 255, 1)'
        },
        {
            label: 'y=x',
            data: [{x:0,y:0},{x:1,y:1}],
            fill: false,
            pointBackgroundColor: 'rgba(0, 0, 0, 0.0)',
            pointBorderColor: 'rgba(0, 0, 0, 0)',
            backgroundColor: 'rgba(0, 0, 0, 1)',
            borderColor: 'rgba(0, 0, 0, 1)'
        }],
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'X_MVC'
                },
            }],
            yAxes: [ {
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Y_MVC'
              }
            } ]
        }
    }
});


let Txychart = new Chart(document.getElementById("Txychart"), {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'X',
            fill: false,
            pointBackgroundColor: 'rgba(0, 0, 255, 0.5)',
            pointBorderColor: 'rgba(0, 0, 255, 0)',
            backgroundColor: 'rgba(0, 0, 255, 1)',
            borderColor: 'rgba(0, 0, 255, 1)'
        },
        {
            label: 'Y',
            fill: false,
            pointBackgroundColor: 'rgba(255, 0, 0, 0.5)',
            pointBorderColor: 'rgba(255, 0, 0, 0)',
            backgroundColor: 'rgba(255, 0, 0, 1)',
            borderColor: 'rgba(255, 0, 0, 1)'
        }],
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Composition_MVC'
                },
            }],
            yAxes: [ {
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Temperature [C]'
              }
            } ]

        }
    }
});


function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
}

function get_float(name) {
    let input = document.getElementById(name).value;
    let x = 0.0;
    if( input == "" ) {
        window.alert(name + " is empty ");
    }
    if( input != "") {
      x = parseFloat(input);
      if (isNaN(x)){
        window.alert(name + " must be a valid number.");
        document.getElementById(name).value = "";
        return;
      }
      else {
        console.log(name + " = " + x);
        return x;
      }
    }
}

function submitted() {
    let MVC_A   = get_float("MVC_A");
    let MVC_B   = get_float("MVC_B");
    let MVC_C   = get_float("MVC_C");
    let LVC_A   = get_float("LVC_A");
    let LVC_B   = get_float("LVC_B");
    let LVC_C   = get_float("LVC_C");
    let step    = get_float("step");
    let P_total = get_float("P_total");
    let min_step = 0.01;
    if(step < min_step ) {
        alert("Temperature interval is too small, defaulting to "+ min_step);
        step = min_step;
    }
    
    let P_vap_LVC = 0;
    let P_vap_MVC = 0;
    let X_MVC = 0;
    let X_LVC = 0;
    let Y_MVC = 0;
    let Y_LVC = 0;

    xypoints = [];
    Txpoints = [];
    Typoints = [];

    let T_BP_LVC = LVC_B/(LVC_A-getBaseLog(10,P_total))-LVC_C;
    let T_BP_MVC = MVC_B/(MVC_A-getBaseLog(10,P_total))-MVC_C;

    let T_max = T_BP_LVC;
    let T_min = T_BP_MVC;
    if( T_BP_MVC > T_BP_LVC ) T_max = T_BP_MVC;
    if( T_BP_LVC < T_BP_MVC ) T_min = T_BP_LVC;

    let atLastTemp = false;
    for( T = T_max; T >= T_min-step && !atLastTemp ; T-=step ) {
        if(T < T_min ){ T = T_min; atLastTemp = true;} ;
        // Antointes equations
        P_vap_LVC = Math.pow(10,LVC_A-LVC_B/(LVC_C+T));
        P_vap_MVC = Math.pow(10,MVC_A-MVC_B/(MVC_C+T));
        // Daltons Law  -- total pressure is summation of partial pressures
        // P_total = Pp_LVC + Pp_MVC
        // insert Raults Law -- partial pressure is equal to vapor pressure times mole frac
        // P_total = P_vap_LVC * X_LVC + P_vap_MVC * X_MVC
        // P_total = P_vap_LVC * (1-MVC) + P_vap_MVC * X_MVC
        // Then do some algebra to get
        X_MVC = (P_total-P_vap_LVC)/(P_vap_MVC-P_vap_LVC)
        X_LVC = 1 - X_MVC;
        // now use raults law again
        Y_MVC = P_vap_MVC*X_MVC/P_total;
        Y_LVC = 1-Y_MVC;
        xypoints.push({x:X_MVC, y:Y_MVC});
        Txpoints.push({x:X_MVC, y:T});
        Typoints.push({x:Y_MVC, y:T});
    }
    xychart.data.datasets[0].data = xypoints;
    xychart.update();
    Txychart.data.datasets[0].data = Txpoints;
    Txychart.data.datasets[1].data = Typoints;
    Txychart.update();

}
</script>


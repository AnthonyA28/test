---
title: Process Control Simulation
layout: article_post
section: article
excerpt: Simulating a process control system of a AR(1) process using a PI controller. 
tags: ChemicalEngineering
---


# Process Control Simulation

Below is a simulation of an AR(1) process with PID control applied to it. 
Change the setpoint to watch the control algorithm approach the target. 
Change the kc, tauI, and kd tuning parameters to vary the control algorithm behavior. 


<canvas id="chart" class="chartjs" width="300" height="150"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<form action="#" onsubmit="update_params();return false">
    <!-- Phi: <input type="text" id="phi_id" value ="0.95"><br> -->
    <!-- standard deviation: <input type="text" id="standard_deviation_id" value ="1.0"><br> -->
    <!-- Sample period (ms) : <input type="text" id="samplePeriod_id" value = "100"><br> -->
    setpoint : <input type="text" id="setpoint_id" value = "10"><br>
    kc : <input type="text" id="kc_id" value = "1.0"><br>
    tauI : <input type="text" id="tauI_id" value= "100"><br>
    kd : <input type="text" id="kd_id" value = "0.0"><br>

    <input type="submit">

</form>

<script>
'use strict';
var phi = 0.9;
var standard_deviation = 1; 
var dt = 200; 

var error = 0 ;
var errorPrev = error;
var u = 0;
var u_prev = 0;
var start_time; 
var y_setpoint = 10;
var kc = 1;
var tauI = 100;
var kd = 0; 
var G = .1;
var sumForIntegral = 0


// returns a gaussian random function with the given mean and stdev.
function gaussian(mean, stdev) {
    // variance of uniform distribution = 1/12 (b-a)^2 *wikipedia
    // dif =  (b-a) 
    let dif = stdev*12.0;
    let max = mean + dif/2.0;
    let min = mean - dif/2.0;
    let n = 100;
    let i = 0
    let sum = 0;
    for (i = 0; i < n; i ++) {
      sum += (Math.random() * (max - min) ) + min;
    }
    return sum/n;
}

function update_params() {
  let input; 
  let x; 
    input = document.getElementById("kc_id").value; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("kc must be a valid number.");
        document.getElementById("kc_id").value = "";
        return; 
      } 
      else {
        kc = x;
      }
    }
    input = document.getElementById("kd_id").value; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("kd must be a valid number.");
        document.getElementById("kd_id").value = "";
        return; 
      } 
      else {
        kd = x;
      }
    }
    input = document.getElementById("setpoint_id").value; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("setpoint must be a valid number.");
        document.getElementById("setpoint_id").value = "";
        return; 
      } 
      else {
        y_setpoint = x;
      }
    }
    input = document.getElementById("tauI_id").value; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("tauI must be a valid number.");
        document.getElementById("tauI_id").value = "";
        return; 
      } 
      else {
        tauI = x;
      }
    }
}

var start_time = new Date().getTime();

var chart = new Chart(document.getElementById("chart"),
    {"type":"line",
        "data":{
          "labels":[],
          "datasets":[
            {
              "label":"Measurement",
              "data":[],
              "fill":false,
              "borderColor":"rgb(75, 192, 192)",
              "lineTension":0.1
            },
            {
              "label":"Input",
              "data":[],
              "fill":false,
              "borderColor":"rgb(175, 12, 192)",
              "lineTension":0.1
            }
            ]
          },
        "options":{}
    },
);


function addData(chart, label, data, series_name) {
    chart.data.datasets.forEach((dataset) => {
      if(dataset.label == series_name){
        if(chart.data.labels[chart.data.labels.length-1]!=label){
            chart.data.labels.push(label);
        }
        dataset.data.push(data);
      }
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}


function time_series_fn(last_y){
    var next_y = phi*last_y + gaussian(0,standard_deviation);;// 
    return next_y;
}

function timed_callback() {
  var current_time = new Date();
  let s = ((current_time - start_time)/1000);
  
  let length = chart.data.datasets[0].data.length;

  if( length>1 ){
    var y_nminus1 = chart.data.datasets[0].data[length-1];
    var y_nminus2 = chart.data.datasets[0].data[length-2];
  } else {
    var y_nminus1 = 0;
    var y_nminus2 = 0;
    addData(chart, s, y_nminus1, "Measurement");
  }

  let y = time_series_fn(y_nminus1);
  errorPrev = error;
  error = y_setpoint - y ;
  // console.log("y: " + y);
  sumForIntegral += kc/tauI*error;
  let propInt = 1 + kc * error + dt * sumForIntegral;
  // let u = propInt;
  let u = propInt + kc * kd/dt * ( y_nminus1 - y_nminus2 );
  
  y = y + G*u;
    console.log(y)
    console.log(u)
  addData(chart, s, y, "Measurement");
  addData(chart, s, u, "Input");
  if(chart.data.labels.length > 50) { removeData(chart)};
  setTimeout(timed_callback, dt);
}



setTimeout(timed_callback, dt);

</script>

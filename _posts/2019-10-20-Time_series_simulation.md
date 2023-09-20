---
title: Time Series Simulation
layout: article_post
section: article
excerpt: Graphing a time series with variable parameters.
tags: CHE
---


# Time Series 

Below is a real time graph of a time series model with some variable parameters. 

The model:
$$
x_t = \phi x_{t-1} + \epsilon_t 
$$
where

 $\ \phi $ is the autocorrelation parameter [-1,1].
 
 $\ \epsilon $ is white noise with a known standard deviation. 

$\ x_t $ is x at time *t*.

$\ x_{t-1}$  is x at time *t-1*.

A few things to note:



* at $\ \phi $ = 0; It is a white noise process. 
* at $\ \phi $ = 1; It is a random walk process. 
* at $\ \| \phi\| $ ≥ 1; The system is nonstationary.





<canvas id="chart" class="chartjs" width="300" height="150"></canvas>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
<form action="#" onsubmit="update_params();return false">
    Phi: <input type="text" id="phi_id"><br>
    standard deviation: <input type="text" id="standard_deviation_id"><br>
    Sample period (ms) : <input type="text" id="samplePeriod_id"><br>
    <input type="submit">
</form>

<script>
'use strict';
var phi = 0;
var standard_deviation = 1; 
var dt = 1000; 

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
    let input = document.getElementById("phi_id").value;
    let x = 0; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("Phi must be a valid number.");
        document.getElementById("phi_id").value = "";
        return; 
      } 
      else {
        phi = x;
      }
    }

    input = document.getElementById("samplePeriod_id").value;
    if ( input != "" ) {
      x = parseFloat(input);
      if (isNaN(x)){
        window.alert("Sample period must be a valid number.");
        document.getElementById("samplePeriod_id").value = "";
        return;
      } 
      else {
        dt = x;
      }
    }
    input = document.getElementById("standard_deviation_id").value; 
    if( input != "") {
      x = parseFloat(input); 
      if (isNaN(x)){
        window.alert("standard_deviation must be a valid number.");
        document.getElementById("standard_deviation_id").value = "";
        return; 
      } 
      else {
        standard_deviation = x;
      }
    }
}

var start_time = new Date().getTime();

var chart = new Chart(document.getElementById("chart"),
    {"type":"line",
        "data":{
        "labels":[],
        "datasets":[{"label":"y",
        "data":[],
        "fill":false,
        "borderColor":"rgb(75, 192, 192)",
        "lineTension":0.1}]},
        "options":{}
    }
);


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
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
  let s = Math.floor((current_time - start_time)/1000.0);
  let length = chart.data.datasets[0].data.length;

  if( length>0 ){
    var y_nminus1 = chart.data.datasets[0].data[length-1]
  } else {
    var y_nminus1 = 0; 
    addData(chart, s, y_nminus1);
  }

  let y = time_series_fn(y_nminus1);
  addData(chart, s, y);
  if(chart.data.labels.length > 50) { removeData(chart)};
  setTimeout(timed_callback, dt);
}



setTimeout(timed_callback, dt);

</script>

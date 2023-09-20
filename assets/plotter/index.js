var filename = "output";
var traces = []
var inputer_traces = [];


var log10 = function (y) {
  return Math.log(y) / Math.log(10);
}

var transpose = function (a) {
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;
  if(h === 0 || w === 0) { return []; }
  var i, j, t = [];
  for(i=0; i<h; i++) {
    t[i] = [];
    for(j=0; j<w; j++) {
      t[i][j] = a[j][i];
    }
  }
  return t;
}

var removeOptions = function (selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
}



function make_trace_boxes(){
  inputer_traces = [];
  for(var j = 0; j< 50; j +=1){
    if( document.getElementById('app'+j.toString()) != null ){
      document.getElementById('app'+j.toString()).remove();
    }
  }
  for(var j = 0; j< traces.length; j +=1){
    var div = document.createElement('div');  //creating element
    div.id = "app" + j.toString();         //adding text on the element
    document.getElementById("data").appendChild(div);           //appending the element

  var palette = document.getElementById("palettes").options[document.getElementById("palettes").selectedIndex].innerText;
  if(palette.endsWith("_")){
    palette = document.getElementById("n_colors").value.concat("_").concat(palette);
    palette = palette.slice(0, -1);
    console.log(palette)
  }


    inputer_traces.push(new inputer(div.id, {
      name: {it: "text", def: "",},
      visible: {it: "option", options: ['true' , 'false' , "legendonly" ]},
      line: {
        width: {it: "number", def: 3,},
        shape: {it: "option", options: ["spline", "linear", "hv", "vh", "hvh", "vhv"],},
        dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
        smoothing: {it: "number", def: 0,},
        color: {it: "option", options: colors_palettes[palette]},
      },
      mode: {it: "option", options: ['lines',"markers", 'text', 'none', 'lines+markers','lines+markers+text' ]},
      marker: {
        size: {it: "number", def: 6,},
        symbol: {it: "option", options: marker_shapes,},
        color: {it: "option", options: colors_palettes[palette]},
      },
      type: {it: "option", options: ["scatter", 'bar']},
    },function(e){
        update();
        if(e.target.id == 'color'){
          var index = e.target.selectedIndex
          if(index >= 0){
            var color = e.target.options[index].text;
            e.target.style.background = color;  
          }
        }
    }));
  }
} 





var inputer_master_trace = new inputer("appM", {
    type: {it: "option", options: ["scatter", 'bar']},
    line: {
      width: {it: "number", def: 3,},
      shape: {it: "option", options: ["spline", "linear", "hv", "vh", "hvh", "vhv"],},
      dash: {it: "option", options: ["solid", "dot", "dash", "longdash", "dashdot", "longdashdot"],},
      smoothing: {it: "number", def: 0,},
      // color: {it: "option", options: colors_palettes["pyDefault"]}, //TODO: 
    },
    mode: {it: "option", options: [ 'lines',"markers", 'text', 'none', 'lines+markers','lines+markers+text' ]},
    marker: {
      size: {it: "number", def: 6,},
      symbol: {it: "option", options: marker_shapes,},
      // color: {it: "option", options: colors_palettes["pyDefault"]}, //TODO: 
    },
  }, function(e){
      var caller = e.target || e.srcElement || window.event.target || window.event.srcElement;
      console.log("callback id: ", caller.id);
      var value = e.target.value
      var key = e.target.id
      console.log("parent",parent );
      for(var j = 0; j< traces.length; j +=1){
        if(e.target.parentElement.previousElementSibling.innerHTML == "Master Trace:"){
          traces[j][key] = value
        }else{
          var parent_key = e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML;
          parent_key = parent_key.slice(0, parent_key.length-1);
          traces[j][parent_key][key] = value;
        }
        inputer_traces[j].update_data(traces[j]);
      }
      update();
});



function plot(header, data, update_nums=false){
  var index_header = 0;
  var datas = []
  var xs = [0]
  var i = 2;
  var ys = [1]
  var reset = false;
  for(var j = 2; j< header.length; j +=1){
    if( reset && (header[j] != "" )){
      xs.push(j);
      reset = false
      i+=1
    }else if( header[j] != "" ){
      ys.push(j);
      i += 1;
    } else if (header[j] == "" ){
      reset = true
    }
  }

  var index_undefined = 0;
  for(var j = 0; j< data.length; j +=1){
    index_undefined = data[j].length;
    if( data[j][data[j].length-1] == undefined || isNaN(data[j][data[j].length-1]) || data[j][data[j].length-1] ==''){
      for(var i =0 ; i < data[j].length; i ++){
        data[j][i] = parseFloat(data[j][i])
        if(data[j][i] == undefined || isNaN(data[j][i]) || ( data[j][i] != 0 && data[j][i] == '') ){
          index_undefined = i
          break;
        }
      }
    }
    data[j] = data[j].slice(0, index_undefined)
  }

  var headers = []
  i = 0;
  j = 0;
  var q = 0;
  while( i < xs.length-1 && q < 100){
    while(j < ys.length && q < 100 && xs[i+1]>ys[j]){
      datas.push([data[xs[i]], data[ys[j]]]);
      headers.push(header[ys[j]]);
      j += 1
    }
    q += 1
    i += 1
  }
  while(j < ys.length && q < 100){
    datas.push([data[xs[xs.length-1]], data[ys[j]]]);
    headers.push(header[ys[j]]);
    j += 1
    q+=1;
  }

  var base_index = 0
  if(!update_nums){
    traces = []
  }else{
    traces = traces.slice(0, datas.length);
  }

  var palette = document.getElementById("palettes").options[document.getElementById("palettes").selectedIndex].innerText;
  if(palette.endsWith("_")){
    palette = document.getElementById("n_colors").value.concat("_").concat(palette);
    palette = palette.slice(0, -1);
    console.log(palette)
  }


  for(var j = 0; j< datas.length; j +=1){
    if( j < traces.length){
      traces[j].x = datas[j][0]
      traces[j].y = datas[j][1]
    }else{

    var marker_shape = marker_shapes[j%marker_shapes.length];
    var line_shape = line_shapes[0];

    
  
    var color = colors_palettes[palette][j%colors_palettes[palette].length];
    

    var trace = {
        x: datas[j][0],
        y: datas[j][1],
        visible: true,
        name: headers[j],
        type: 'scatter',
        mode: 'lines',
        marker: {
            size: 6,
            symbol: marker_shape,
            color: color,
          },

      line: {
        shape: "spline",
        dash: line_shape,
        width: 3,
            color: color,
      },
    }
    traces.push(trace)
    }
  }
  

  make_trace_boxes();
  for(var i = 0; i < traces.length; i ++ ){
    inputer_traces[i].update_data(traces[i]);
  }
  document.getElementById("n_colors").value = traces.length

  if(!update_nums){
    var layout = inputer_layout.get_data();
    layout.xaxis.title.text = header[0];
    layout.yaxis.title.text = header[1];
    if(traces.length >1){
      layout.showlegend = true;
    }else{
      layout.showlegend = false;
    }
    inputer_layout.update_data(layout);
  }

  document.getElementById("palettes").dispatchEvent(new Event('change')); // Force the inputer_traces color options box to update color 


  Plotly.newPlot(document.getElementById('gd'), traces, inputer_layout.get_data(), {
      modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d'],
      modeBarButtonsToAdd: [{
        name: 'to SVG',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          // Plotly.downloadImage(gd, {format: 'svg'})
          save_plot("svg")
        }},{
        name: 'to png',
        icon: Plotly.Icons.camera,
        click: function(gd) {
          save_plot("png");
          // Plotly.downloadImage(gd, {format: 'png', scale:8})
        }
      }]
  },);
    
};



var inputer_layout = new inputer("app", OPT_inputer_layout , function(e){
  update();
});


function input_csv(selectedFile) {
  Papa.parse(selectedFile, {
    dynamicTyping: false,
    complete: function(results) {
      header = results.data[0]
      datapoints = []

      for(var i = 1; i < results.data.length; i ++){
        row = []
        for(var j = 0; j< header.length; j +=1){
          x = parseFloat(results.data[i][j])
          row.push(x)
        }
        datapoints.push(row)
      }
      datapoints = transpose(datapoints)
      var update_date = false;
      if( traces.length > 0){
        update_date = true;
      }
      plot(header, datapoints, update_date)
      update();
    }
  })
};



function save_plot(type){
  console.log(filename)
  if( type == "png"){
    Plotly.downloadImage(gd, {format: 'png', scale:8, filename})
    return;
  }
  if( type == "svg"){
    // const config={type:'save-file'}
    // dialog(config)
    //     .then(file => {
    //      console.log(file[0])
          Plotly.downloadImage(gd, {
              // filename: file[0],
              format: 'svg',
            }).then(result => {
          console.log(result);
          console.log("Should save a template as well..");
        });
        // })
        // .catch(err => console.log(err))

    return
  }
}

function selectOption(elem, index, trigger=false){
  if (index == 0) { 
    elem.options.selectedIndex = index;
  }
  else {
    elem.options.selectedIndex = (index );
  }
  if ("createEvent" in document) {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    if(trigger){
      elem.dispatchEvent(evt);
    }
  }
  else if(trigger) {
    elem.fireEvent("onchange");
  }
}

function import_json(json_text, update_data=true, update_trace_styles=true, update_trace_names = false, update_axes_labels=false){


  var prevLayout = inputer_layout.get_data();
  var json = JSON.parse(json_text)
  var l = json["layout"]


    var elem = document.getElementById("palettes");
    var colors =[...elem.options].map(o => o.value)
    pal = json["palette"]
    if( pal.endsWith("_")){
      document.getElementById("n_colors").value = parseInt(pal.slice(0,1))
      pal = pal.slice(2)
      console.log(pal);
    }
    selectOption(elem, colors.indexOf(pal));
    pal = json["palette"]
    if( pal.endsWith("_")){
      pal = pal.slice(0, -1)
      console.log(pal);
    }

    
  var prev_data = []
  for(var i = 0 ; i < traces.length; i ++ ){
    var trace_data = {
      "x": traces[i]['x'],
      "y": traces[i]['y'],
      'name': traces[i]['name']
    }
    prev_data.push(trace_data);
    
  }
  var new_traces = json["traces"];
  for(var i = 0 ; i < new_traces.length &&  i < new_traces.length; i ++ ){
    new_traces[i]['name'] = decodeURIComponent(new_traces[i]['name'])
  }
  if(!update_data){
    for(var i = 0 ; i < prev_data.length && i < new_traces.length &&  i < traces.length; i ++ ){
      new_traces[i]['x'] = prev_data[i]['x']
      new_traces[i]['y'] = prev_data[i]['y']
      if( !update_trace_names ){   
        new_traces[i]['name'] = traces[i]['name']
      } 
    }
  }
  l.xaxis.title.text  = decodeURIComponent(l.xaxis.title.text);
  l.yaxis.title.text  = decodeURIComponent(l.yaxis.title.text);
  if(prev_data.length > 0 ){
    if( !update_axes_labels ){
      l.xaxis.title.text  = prevLayout.xaxis.title.text
      l.yaxis.title.text  = prevLayout.yaxis.title.text
    }
  }
  inputer_layout.update_data(l);

  if(update_data){
    traces = structuredClone(new_traces);
  }

  if( update_trace_styles || inputer_traces.length == 0 ){
    make_trace_boxes();
    for(var i = 0 ; i < inputer_traces.length && i < traces.length && i < new_traces.length; i ++){
      inputer_traces[i].update_data(new_traces[i]);
      inputer_traces[i].fill_json(traces[i]);
    }
    for(var i = new_traces.length; i < traces.length; i ++ ){
      inputer_traces[i].update_data(traces[i]);
      inputer_traces[i].fill_json(traces[i]); 
    }


    for(var i = 0 ; i < inputer_traces.length && i < new_traces.length; i ++) {
      var index = colors_palettes[pal].indexOf(new_traces[i].line.color);
      selectOption(inputer_traces[i].inputs.line.color.elem, index);
      index = colors_palettes[pal].indexOf(new_traces[i].marker.color);
      selectOption(inputer_traces[i].inputs.marker.color.elem, index);
    }
    for(var i = new_traces.length; i < inputer_traces.length; i ++ ){
      // var index = colors_palettes[pal].indexOf(traces[i].marker.color);
      selectOption(inputer_traces[i].inputs.marker.color.elem,i%colors_palettes[pal].length);
      // index = colors_palettes[pal].indexOf(new_traces[i].line.color);
      selectOption(inputer_traces[i].inputs.line.color.elem,i%colors_palettes[pal].length);
    }
    
  }

  Plotly.newPlot(document.getElementById('gd'), traces, inputer_layout.get_data(), {
    modeBarButtonsToRemove: ['toImage', 'sendDataToCloud', 'select2d', 'lasso2d'],
    modeBarButtonsToAdd: [
    {
      name: 'to SVG',
      icon: Plotly.Icons.camera,
      click: function(gd) {
        save_plot("svg");
      }
    },{
      name: 'to png',
      icon: Plotly.Icons.camera,
      click: function(gd) {
        save_plot("png");
      }
    }] // END modeBarButtonsToAdd
    },); // END Plotly.newPlot

    update();


    // Update the colors in the color options dropdowns by triggering palette changed 
    var event = new Event('change');
    document.getElementById("palettes").dispatchEvent(event);
  
}

function update(){
  document.getElementById("gd_div").style.width = inputer_layout.get_data()['width'];
  for(var i = 0 ; i < traces.length; i ++){
    traces[i] = inputer_traces[i].fill_json(traces[i]);
    inputer_traces[i].update_data(traces[i]);
  }

  var l = inputer_layout.get_data();
  Plotly.relayout(document.getElementById('gd'), l);

}

function get_template_text(){

  for(var i = 0 ; i < traces.length; i ++){
    traces[i].name = traces[i].name.replace(/\s/g,' ');
    traces[i].name = encodeURIComponent(traces[i].name)
  }
  if ( !filename.endsWith(".json")){
    filename = filename.concat(".json")
  }

  var layout = inputer_layout.get_data();

  layout.xaxis.title.text  = encodeURIComponent(layout.xaxis.title.text);
  layout.yaxis.title.text  = encodeURIComponent(layout.yaxis.title.text);
  var index = document.getElementById("palettes").selectedIndex
  var palette = document.getElementById("palettes").options[index].innerText;
  if(palette.endsWith("_")){
    palette = document.getElementById("n_colors").value.concat("_").concat(palette);
  }

  var json = {layout, traces, palette}
  var text = JSON.stringify(json);

  for(var i = 0 ; i < traces.length; i ++){
    traces[i].name = decodeURIComponent(traces[i].name);
  }
  return text;
}

document.getElementById('download').addEventListener( 'click', function(){

    var output_file = filename;
    console.log(output_file);
    const element = document.createElement('a');
    var json_text = get_template_text();

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json_text));
    element.setAttribute('download', output_file.concat(".json"));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

});


document.getElementById('save_template').addEventListener( 'click', function(){

    var json_text = get_template_text();
    var name_ = prompt("Enter name of template to save:");

    localStorage.setItem("LocalStorage_".concat(name_), json_text);

});



document.getElementById('helper_reset_colors').addEventListener( 'click', function(){
  console.log("helper_reset_colors")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = i
    inputer_traces[i].inputs.line.color.elem.selectedIndex = i
  }
  update();
});

document.getElementById('helper_pair_colors').addEventListener( 'click', function(){
  console.log("helper_pair_colors")
  
  var j = 0;
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = j
    inputer_traces[i].inputs.line.color.elem.selectedIndex = j
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.marker.color.elem.selectedIndex = j
    inputer_traces[i].inputs.line.color.elem.selectedIndex = j
    j+=1
  }
  update();
});

document.getElementById('helper_pair_markers').addEventListener( 'click', function(){
  console.log("helper_pair_markers")
  
  var j = 0;
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = j;
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.marker.symbol.elem.selectedIndex = j+8;
    j += 1;
  }
  update();
});

document.getElementById('helper_pair_linestyles').addEventListener( 'click', function(){
  console.log("helper_pair_linestyles")
  
  for(var i = 0; i < inputer_traces.length; i += 1 ){
    inputer_traces[i].inputs.line.dash.elem.selectedIndex = 0;
    i += 1
    if(i >= inputer_traces.length){
      break
    }
    inputer_traces[i].inputs.line.dash.elem.selectedIndex = 1;
  }
  update();
});





document.getElementById("palettes").addEventListener("change", function (){
  console.log("Color Palette selected ")
  var index = document.getElementById("palettes").selectedIndex
  var color = document.getElementById("palettes").options[index].innerText
  if(color.endsWith("_")){
    var n_colors = document.getElementById("n_colors").value
    console.log("n_colors ", n_colors);
    if(n_colors>12){
      n_colors = 12;
    }
    else if(n_colors<2){
      n_colors = 2;
    }
    color = n_colors.toString().concat("_").concat(color.slice(0, color.length-1));
  }
  if( colors_palettes[color] == undefined ){
    return;
  }

  function set_color_options(inputer){ //todo
    var index_marker_color = inputer.inputs.marker.color.elem.selectedIndex;
    var index_line_color = inputer.inputs.line.color.elem.selectedIndex;
    inputer.inputs.marker.color.options=colors_palettes[color]
    inputer.inputs.line.color.options=colors_palettes[color]
    function replace_options(dropdown, new_index){
      removeOptions(dropdown);
      for(var j=0;j<colors_palettes[color].length;j++){
        var opt = document.createElement("option");
        opt.text = colors_palettes[color][j];
        opt.value = colors_palettes[color][j];
        opt.style.background = colors_palettes[color][j];
        dropdown.style.marginLeft = '15px'
        dropdown.options.add(opt);
      }
      selectOption(dropdown, new_index);
      dropdown.style.background = dropdown.options[dropdown.selectedIndex].text;  
    }
    replace_options(inputer.inputs.line.color.elem, index_line_color%colors_palettes[color].length)
    replace_options(inputer.inputs.marker.color.elem, index_marker_color%colors_palettes[color].length)
  }
      
  for(var i = 0 ; i < traces.length; i ++) {
    set_color_options(inputer_traces[i]);
  }

  update();
});


function resetFileInput() {
    var fileInput = document.getElementById('input_file');
    fileInput.type = 'text';  // Change the type temporarily to allow cloning
    var newFileInput = fileInput.cloneNode(true);
    newFileInput.type = 'file';  // Change the type temporarily to allow cloning
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
  newFileInput.addEventListener('change', input_file_event);
}


function  input_file_event(){
  if (!this.files && !this.files[0]) {
    return;
  }
  console.log("Inputting file")
  console.log(this.files[0]);
  filename = this.files[0].name
  load_file(this.files[0])
  resetFileInput();
}
var input = document.getElementById('input_file')
input.addEventListener("change", input_file_event);


function load_file(file){
  var name = file.name;

   console.log("Load file") 
   // get_file();

  if( name.endsWith(".csv") ){

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var csvdata = event.target.result.toString();
      data = csvdata.split('\n') // split string to lines
          .map(e => e.trim()) // remove white spaces for each line
          .map(e => e.split(',').map(e => e.trim())); // split each line to array;
          console.log(data);

        console.log("Data:")                            
      var header = data[0];
      var data = data.slice(1, data.length);
      plot(header, transpose(data), data[0]);
          // event.sender.send('load_file-task-finished', [false, data]); 
    }

  
  }else if( name.endsWith(".xlsx") ){

    var reader = new FileReader();
    
    reader.onload = function(e) {
        var data = e.target.result;
        var header = []
      const wb = XLSX.read(data, {type: 'binary'});
      const sheet = wb.Sheets[wb.SheetNames[0]]
      console.log(sheet);
      for(var n =0; n < 25; n ++ ) {
        var cell = String.fromCharCode(65 + n);
        if( sheet[cell.concat("1")] == undefined){
          header.push('');
        }else{
          header.push(sheet[cell.concat("1")].v)
        }
      }

      console.log(header) 

    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Get maximum number of columns
      const maxColumns = Math.max(...jsonData.map((row) => row.length));

      // Convert all cells to a list of arrays
      const cells = [];
      for (let i = 0; i < maxColumns; i++) {
        const columnData = jsonData.map((row) => row[i]);
        columnData.shift(); // Remove the first item from each column
        cells.push(columnData);
      }

    console.log(cells);
    plot(header, cells);
  }
    reader.readAsBinaryString(file);

  }

    if(name.endsWith(".json")){
      var reader = new FileReader();
      reader.addEventListener('load', function (e) {
        import_json(e.target.result, true, true, true, true)
      });reader.readAsBinaryString(file);
  }

}





function load_templ(index){
  var update_trace_styles = document.getElementById("update_trace_styles_check").checked;
  var update_trace_names = document.getElementById("update_trace_names_check").checked;
  var update_axes_labels = document.getElementById("update_axes_labels_check").checked;
  import_json(templates_list[index][1], false, update_trace_styles, update_trace_names, update_axes_labels);
}


function change_template(){
  console.log("Choosing template");
  var index = document.getElementById('template_dropdown').selectedIndex
  var template_name = document.getElementById('template_dropdown').options[index].innerText;
  console.log(template_name);

  for (let i = 0; i < templates_list.length; i++) {
    const tuple = templates_list[i];
    if (tuple[0] === template_name) {
      load_templ(i);
    }
  } 
}

var dropdown = document.createElement("select");
dropdown.id = 'template_dropdown';
var opt = document.createElement("option");

// Get the localStorage Templates 
// Get the total number of items in localStorage
var itemCount = localStorage.length;

// Iterate through each item
for (var i = 0; i < itemCount; i++) {
  // Get the key at the current index
  var key = localStorage.key(i);

  // Check if the key starts with "template_"
  if (key.startsWith("LocalStorage_")) {
    // Retrieve the value associated with the key
    var value = localStorage.getItem(key);

    templates_list.push([key.split("_")[1], value])

    // Perform your desired operations with the key and value
    console.log("Key: " + key + ", Value: " + value);
  }
}


for (let i = 0; i < templates_list.length; i++) {
  var opt = document.createElement("option");
  opt.text = templates_list[i][0];
  dropdown.options.add(opt);
}
dropdown.onchange =  change_template;
document.getElementById("template_div").appendChild(dropdown);


function load_default_template(){
  for (var i = 0; i < dropdown.options.length; i++) {
    var option = dropdown.options[i];
    var optionValue = option.value;
    var optionText = option.text;
    console.log("Option " + i + ": Value=" + optionValue + ", Text=" + optionText);
    if( optionText == "default"){
      load_templ(i);
      console.log("Loading default")
      dropdown.selectedIndex = i
      return;
    }  
  }
  load_templ(0);
}

document.getElementById("delete_template").addEventListener('click', function(){
  var selectedOption = dropdown.options[dropdown.selectedIndex];
  var selectedText = selectedOption.text;

  var name = "LocalStorage_" + selectedText;
  console.log("Deleting " + name)

  var item = localStorage.getItem(name);

  if (item !== null) {
    console.log('Item exists in localStorage');
    localStorage.removeItem(name);
    dropdown.options[dropdown.selectedIndex].remove();
  } else {
    console.log('Item does not exist in localStorage');
  }
});

document.getElementById('make_default_template').addEventListener( 'click', function(){

    var json_text = get_template_text();
    var name_ = "default"
    localStorage.setItem("LocalStorage_".concat(name_), json_text);

});

load_default_template()

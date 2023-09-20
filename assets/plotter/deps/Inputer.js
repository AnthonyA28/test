

var range_scale = 1;

class inputer {

  make_input(cur_inputs, parent, key, callback){

    function make_input_title(parent, title){
      const button = document.createElement('button')
      button.className = "collapsible";
      button.textContent = title.concat(":");
      button.style.display = "inline-block";
      button.style.marginLeft = '10px'
      button.tabIndex = "-1";
      parent.appendChild(button)
    }

    if(!cur_inputs[key].hasOwnProperty('it')){
      make_input_title(parent, key);
      var br = document.createElement("br");
      parent.appendChild(br);
      let div = document.createElement("div");
      div.style.display = "none";
      div.style.marginLeft = '20px'
      parent.appendChild(div)
      this.make_inputs(cur_inputs[key], div, callback);

    }else if(cur_inputs[key]['it'] == "text"){
      make_input_title(parent, key);
      const input = document.createElement("input");
      input.id = key
      input.setAttribute("type", "text");
      input.style.marginLeft = '15px'
      cur_inputs[key].hasOwnProperty('def');
      input.value = cur_inputs[key]['def'];
      input.onchange =  callback;
      parent.appendChild(input);
      cur_inputs[key]["elem"] = input
      var br = document.createElement("br");
      parent.appendChild(br);
    }else if(cur_inputs[key]['it'] == "option"){
      make_input_title(parent, key);
      var dropdown = document.createElement("select");
      dropdown.id = key;
      for(var i=0;i<cur_inputs[key]['options'].length;i++){
        var opt = document.createElement("option");
        opt.key = key
        opt.text = cur_inputs[key]['options'][i];
        opt.value = cur_inputs[key]['options'][i];
        dropdown.style.marginLeft = '15px'
        dropdown.options.add(opt);
      }
      dropdown.onchange =  callback;
      parent.appendChild(dropdown);
      cur_inputs[key]["elem"] = dropdown
      var br = document.createElement("br");
      parent.appendChild(br);
    }else if(cur_inputs[key]['it'] == "slider"){
      make_input_title(parent, key);
      const input = document.createElement("Input");
      input.id = key
      input.setAttribute("type", "range");
      cur_inputs[key].hasOwnProperty('def');
      input.value = cur_inputs[key]['def']*range_scale;
      input.style.marginLeft = '15px';
      input.style.width = '300px'
      input.onchange =  callback;
      input.oninput =  callback;
      if(Object.hasOwn(cur_inputs[key], 'step')){
        input.step = cur_inputs[key]['step']*range_scale
      }
      if(Object.hasOwn(cur_inputs[key], 'min')){
        input.min = cur_inputs[key]['min']*range_scale
      }
      if(Object.hasOwn(cur_inputs[key], 'max')){
        input.max = cur_inputs[key]['max']*range_scale
      }
      parent.appendChild(input);
      cur_inputs[key]["elem"] = input
      var br = document.createElement("br");
      parent.appendChild(br);
      
    }else if(cur_inputs[key]['it'] == "number"){
      make_input_title(parent, key);
      const input = document.createElement("input");
      input.id = key
      input.setAttribute("type", "number");
      cur_inputs[key].hasOwnProperty('def');
      input.value = cur_inputs[key]['def'];
      input.style.marginLeft = '15px';
      input.onchange =  callback;
      if(Object.hasOwn(cur_inputs[key], 'step')){
        input.step = cur_inputs[key]['step']
      }
      if(Object.hasOwn(cur_inputs[key], 'min')){
        input.min = cur_inputs[key]['min']
      }
      parent.appendChild(input);
      cur_inputs[key]["elem"] = input
      var br = document.createElement("br");
      parent.appendChild(br);
    }else if(cur_inputs[key]['it'] == "boolean"){
      make_input_title(parent, key);
      const input = document.createElement("input");
      input.id = key
      input.setAttribute("type", "checkbox");
      cur_inputs[key].hasOwnProperty('def');
      input.checked = cur_inputs[key]['def'];
      input.style.marginLeft = '15px';
      cur_inputs[key]["elem"] = input;
      input.onchange =  callback;
      parent.appendChild(input);
      var br = document.createElement("br");
      parent.appendChild(br);
    }else if(cur_inputs[key]['it'] == "array"){
      make_input_title(parent, key);

      var br = document.createElement("br");
      parent.appendChild(br);


      // parent.appendChild(div)
      for(var i = 0; i < cur_inputs[key]['def'].length; i++){
        const input = document.createElement("input");
        input.id = key.concat(i.toString())
        input.setAttribute("type", "number");
        cur_inputs[key].hasOwnProperty('def');
        input.value = cur_inputs[key]['def'][i];
        input.style.marginLeft = '15px';
        input.onchange =  callback;
        parent.appendChild(input);
        cur_inputs[key]["elem".concat(i.toString())] = input

      }
      var br = document.createElement("br");
      let div = document.createElement("div"); // move this up before for and set parent to div to make is collapsable
      div.style.display = "none";
      div.style.marginLeft = '20px'
      div.appendChild(br)
      parent.appendChild(br);
    }
  }

  make_inputs(cur_inputs, parent, callback){
    for(const key in cur_inputs){
      // console.log(key)
      this.make_input(cur_inputs, parent, key, callback)
    }
  }

  get_data(){

    function iterate(cur_inputs, output){
      for(const key in cur_inputs){
        if(!cur_inputs[key].hasOwnProperty('it')){
          output[key] = {};
          iterate(cur_inputs[key], output[key]);
        }else{
          console.log(cur_inputs[key]['it'])
          if(cur_inputs[key]['it'] == 'boolean'){
            output[key] = cur_inputs[key]['elem'].checked;
          }else if(cur_inputs[key]['it'] == 'number'){
            output[key] = parseFloat(cur_inputs[key]['elem'].value);
          }else if(cur_inputs[key]['it'] == 'slider'){
            output[key] = cur_inputs[key]['elem'].value/range_scale;
            console.log("Here")
            console.log(cur_inputs[key]['elem'].value);
          }else if(cur_inputs[key]['it'] == 'text'){
            output[key] = cur_inputs[key]['elem'].value;
          }else if(cur_inputs[key]['it'] == 'option'){
            var val = cur_inputs[key]['elem'].value;
            if(val == 'true'){
              output[key] = true;
            }else if (val == 'false'){
              output[key] = false;
            }else{
              output[key] = val;
            }
          }else if(cur_inputs[key]['it'] == 'array'){
            var arr = []
            for(var i = 0; i < cur_inputs[key]['def'].length; i ++ ){
              arr.push(parseFloat(cur_inputs[key]['elem'.concat(i)].value));
            }
            output[key] = arr;
          }

        }
        // this.make_input(inputs, parent, key)
      }
    }
    var output = {};
    iterate(this.inputs, output);


    // var output = {};
    // output['line_style'] = inputs['line_style']['elem'].value
    return output
  }

  fill_json(old_json){
    // cur_vals = this.get_data();
    var new_json = structuredClone(old_json)

    function iterate(cur_inputs, output){
      for(const key in cur_inputs){
        if(!cur_inputs[key].hasOwnProperty('it')){
          iterate(cur_inputs[key], output[key]);
        }else{
          if( output.hasOwnProperty(key) ){
            if(cur_inputs[key]['it'] == 'boolean'){
              output[key] = cur_inputs[key]['elem'].checked;
            }else if(cur_inputs[key]['it'] == 'number'){
              output[key] = parseFloat(cur_inputs[key]['elem'].value);
            }else if(cur_inputs[key]['it'] == 'slider'){
              output[key] = parseFloat(cur_inputs[key]['elem'].value)/range_scale;
            }else if(cur_inputs[key]['it'] == 'text'){
              output[key] = cur_inputs[key]['elem'].value;
            }else if(cur_inputs[key]['it'] == 'option'){
              var val = cur_inputs[key]['elem'].value;
              if( val == 'true'){
                val = true
              }else if( val == 'false'){
                val = false;
              }
              output[key] = val;
            }
          }

        }
        // this.make_input(inputs, parent, key)
      }
    }
    iterate(this.inputs, new_json);
    return new_json

  }

  update_data(new_data){
    function iterate(cur_inputs, new_d){
      for(const key in cur_inputs){
        if(new_d.hasOwnProperty(key)){
          if(!cur_inputs[key].hasOwnProperty('it')){
            iterate(cur_inputs[key], new_d[key]);
          }else{
            if(cur_inputs[key]['it'] == 'boolean'){
              cur_inputs[key]['elem'].checked = new_d[key];
            }else if(cur_inputs[key]['it'] == 'number' || cur_inputs[key]['it'] == 'text'){
              cur_inputs[key]['elem'].value = new_d[key];
            }else if(cur_inputs[key]['it'] == 'option'){
              // cur_inputs[key]['elem'].value;
              var val = new_d[key];
              if(val == false){
                val = "false";
              }else if(val == true){
                val = "true"
              }
              var index = cur_inputs[key]['options'].findIndex((element) => element === val);
              cur_inputs[key]['elem'].selectedIndex = index;
              // console.log(index);
            }else if(cur_inputs[key]['it'] == 'array'){
              for(var i = 0; i < new_d[key].length; i ++ ){
                cur_inputs[key]['elem'.concat(i)].value = parseFloat(new_d[key][i]);
                // arr.push(parseFloat(cur_inputs[key]['elem'.concat(i)].value));
              }
            }

          }
        }
        // this.make_input(inputs, parent, key)
      }
    }
    var output = {};
    iterate(this.inputs, new_data);

    if(Object.hasOwn(new_data, 'name') ){
      this.label.innerHTML = new_data['name']
    }
    return output

  }

  constructor(_id, _inputs, callback=function(){}) {
    this.id = _id
    this.inputs = _inputs;
    const loc = document.getElementById(this.id);
    this.label = document.createElement('label')
    if(Object.hasOwn(this.inputs, 'name') ){
      this.label.innerHTML = this.inputs['name']['def'];
      this.label.style.display = "inline-block";
      this.label.style.fontWeight = "1000";
      this.label.style.fontSize = "large";
      document.getElementById(this.id).appendChild(this.label)
      var br = document.createElement("br");
      document.getElementById(this.id).appendChild(br);
    }

    this.make_inputs(this.inputs, loc, callback);

    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
      if(document.getElementById(this.id).contains(coll[i])){
        coll[i].addEventListener("click", func, false);
      }
    }
      function  func(){
        this.classList.toggle("active");
        var sib = this.nextSibling.nextSibling;
        if( sib.tagName == 'DIV'){
          if (sib.style.display === "block") {

            sib.style.display = "none";
          } else {
            sib.style.display = "block";
          }
        }
      };

  }
}

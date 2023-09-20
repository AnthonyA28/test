
// var P;
// (function() {
//  P = [];
//  console.log("init P " + P );
//  })();

"use strict";

/* Building Scope */
{




/***
    Returns the part of the map zoomed in onto.
*/
let force_size_restrictions = true;
function curMap() {
    if(force_size_restrictions){
        if( G_zoom.x2 - G_zoom.x1 > 256 ){
            G_zoom.x2 = G_zoom.x1 + 255;
        }
        if( G_zoom.y2 - G_zoom.y1 > 128 ){
            G_zoom.y2 = G_zoom.y1 + 127;
        }
    }
    let sx = G_zoom.x1;
    let sy = G_zoom.y1;
    let ex = G_zoom.x2;
    let ey = G_zoom.y2;
    return PXMPS[pxmpNum()].slice(sx, ex + 1).map(i => i.slice(sy, ey + 1));
}


var builder_keypress_fn = function (e){
    e = e || event; // to deal with IE
    G_keys[e.keyCode] = e.type == 'keydown';
    // console.log(G_keys);
    // shift + S

    if( G_keys[16] && G_keys[83] ){
        let event = new MouseEvent("click");
        docElem("stamp_map").dispatchEvent(event);
        return;
    }
    // shift + C
    if( G_keys[16] && G_keys[67] ){
        let event = new MouseEvent("click");
        docElem("copy_map").dispatchEvent(event);
        return;
    }

    // shift + M
    if( G_keys[16] && G_keys[77] ){
        let event = new MouseEvent("click");
        docElem("export_GAMEINFO").dispatchEvent(event);
        return;
    }

    /*  Z */
    if( G_keys[16] && G_keys[90]) {
        undo();
        return;
    }
   /*  U */
    if( G_keys[16] && G_keys[85]) {
        redo();
        return;
    }


    /* H + numericKey<W> */
    if(G_keys[72]) {
        var num;
        for(num=1; num < 10; num++) {
            if( !G_keys[(num+48)] ) continue;
            docElem("width").value = (num);
            let event = new MouseEvent("input");
            docElem("width").dispatchEvent(event);
        }
        return;
    }

    /*  J + numericKey<W> */
    if(G_keys[74]) {
        var num;
        for(num=0; num < 10; num++) {
            // alert("num " + num);
            if( !G_keys[(num+48)] ) continue;
            docElem("pixMap_num").value = (num);
            let event = new MouseEvent("input");
            docElem("pixMap_num").dispatchEvent(event);
        }
        return;
    }

    /*  K + numericKey<W> */
    if(G_keys[75]) {
        var num;
        for(num=0; num < 10; num++) {
            if( !G_keys[(num+48)] ) continue
            docElem("resize_x").value = (num);
        }
        return;
    }

    /*  L + numericKey<W> */
    if(G_keys[76]) {
        var num;
        for(num=0; num < 10; num++) {
            if( !G_keys[(num+48)] ) continue
            docElem("resize_y").value = (num);
        }
        return;
    }


    /* shift +  E */
    if(G_keys[16] && G_keys[69] ) {
        let curMap = parseInt( docElem("copy_map_num").value );
        if( !isNaN(curMap)){
            curMap += 1
            if ( curMap >= PXMPS.length ) return;
            docElem("copy_map_num").value = curMap;
            G_stamp = clone(PXMPS[docElem("copy_map_num").value]);
            docElem("json").value = JSON.stringify(G_stamp);
        }
        refresh_canvas();
        return;
    }

    /* shift +  W */
    if( G_keys[16] && G_keys[87] ) {
        let curMap = parseInt( docElem("copy_map_num").value );
        if( !isNaN(curMap)  ){
            curMap -= 1
            if ( curMap < 0 ) return;
            docElem("copy_map_num").value = curMap;
            G_stamp = clone(PXMPS[docElem("copy_map_num").value]);
            docElem("json").value = JSON.stringify(G_stamp);
        }
        refresh_canvas();
        return;
    }


    /*  E */
    if(G_keys[69] ) {
        let curMap = parseInt(pxmpNum());
        if( !isNaN(curMap)){
            curMap += 1
            if ( curMap >= PXMPS.length ) return;
            docElem("pixMap_num").value = curMap;
            let event = new MouseEvent("input");
            docElem("pixMap_num").dispatchEvent(event);
        }
        return;
    }

    /*  W */
    if( G_keys[87] ) {
        let curMap = parseInt(pxmpNum());
        if( !isNaN(curMap)  ){
            curMap -= 1
            if ( curMap < 0 ) return;
            docElem("pixMap_num").value = curMap;
            let event = new MouseEvent("input");
            docElem("pixMap_num").dispatchEvent(event);
        }
        return;
    }

    /*  S */
    if( G_keys[83] ) {
        docElem("stamp").checked = !docElem("stamp").checked; ;
        let event = new MouseEvent("input");
        docElem("stamp").dispatchEvent(event);
        return;
    }
    /*  C */
    if( G_keys[67] ) {
        console.log("Copy shortcut ");
        let event = new MouseEvent("click");
        docElem("copy").dispatchEvent(event);
        return;
    }
    /*  D */
    if( G_keys[68] ) {
        docElem("dropper").checked = !docElem("dropper").checked;
        let event = new MouseEvent("input");
        docElem("dropper").dispatchEvent(event);
        return;
    }
    /*  G */
    if( G_keys[71] ) {
        docElem("show_grid").checked = !docElem("show_grid").checked;
        let event = new MouseEvent("input");
        docElem("show_grid").dispatchEvent(event);
        return;
    }
    /*  F */
    if( G_keys[70] ) {
        let event = new MouseEvent("click");
        docElem("fill_rectangle").dispatchEvent(event);
        return;
    }

    /*  shift A */
    if( G_keys[16] & G_keys[65] ) {
        let event = new MouseEvent("click");
        docElem("reset_zoom").dispatchEvent(event);
        return;
    }
    /*   A */
    if( G_keys[65] ) {
        let event = new MouseEvent("click");
        docElem("zoom").dispatchEvent(event);
        return;
    }
    /*  B */
    if( G_keys[66] ) {
        docElem("bucket").checked = !docElem("bucket").checked;
        let event = new MouseEvent("input");
        docElem("bucket").dispatchEvent(event);
        return;
    }
   /*  Q */
    if( G_keys[81] ) {
        docElem("color").value = "-1";
        let event = new MouseEvent("keyup");
        docElem("color").dispatchEvent(event);

        return;
    }
    /*  O */
    if( G_keys[79] ) {
        let event = new MouseEvent("click");
        docElem("reset_map").dispatchEvent(event);
        return;
    }
    /*  shift +  P */
    if( G_keys[16] && G_keys[80] ) {
        let event = new MouseEvent("click");
        docElem("resize").dispatchEvent(event);
        return;
    }
    /*   T */
    if(  G_keys[84] ) {
        docElem("rectangle").checked = !docElem("rectangle").checked;
        let event = new MouseEvent("input");
        docElem("rectangle").dispatchEvent(event);
        return;
    }

    /*   R */
    if(  G_keys[82] ) {
        let event = new MouseEvent("click");
        docElem("previous_map").dispatchEvent(event);
        return;
    }

    if( G_keys[37] && ( G_keys[16] || G_keys[17])) {
        let movement = 8;
        if( G_keys[17]) movement = 32;
        if( G_keys[16] && G_keys[17]) movement = 128;
        if( G_zoom.x1 -movement  >= 0 ){
            G_zoom.x1 -=movement;
            G_zoom.x2 -=movement;
        } else {
            G_zoom.x2 = G_zoom.x2 - G_zoom.x1;
            G_zoom.x1 = 0;
        }
        window.requestAnimationFrame(draw);
    }
    if( G_keys[38] && ( G_keys[16] || G_keys[17])) {
        let movement = 8;
        if( G_keys[17]) movement = 32;
        if( G_keys[16] && G_keys[17]) movement = 128;
        if( G_zoom.y1 -movement  >= 0 ){
            G_zoom.y1 -=movement;
            G_zoom.y2 -=movement;
        }else {
            G_zoom.y2 = G_zoom.y2 - G_zoom.y1;
            G_zoom.y1 = 0;
        }
        window.requestAnimationFrame(draw);
    }
    if( G_keys[39] && ( G_keys[16] || G_keys[17])) {
        let movement = 8;
        if( G_keys[17]) movement = 32;
        if( G_keys[16] && G_keys[17]) movement = 128;
        if( G_zoom.x2 +movement  < PXMPS[pxmpNum()].length ){
            G_zoom.x1 +=movement;
            G_zoom.x2 +=movement;
        } else {
            G_zoom.x1 = PXMPS[pxmpNum()].length-1 - (G_zoom.x2-G_zoom.x1);
            G_zoom.x2 = PXMPS[pxmpNum()].length-1;
        }
        window.requestAnimationFrame(draw);
    }
    if( G_keys[40] && ( G_keys[16] || G_keys[17])) {
        let movement = 8;
        if( G_keys[17]) movement = 32;
        if( G_keys[16] && G_keys[17]) movement = 128;
        if( G_zoom.y2 +movement  < PXMPS[pxmpNum()][0].length ){
            G_zoom.y1 +=movement;
            G_zoom.y2 +=movement;
        } else {
            G_zoom.y1 = PXMPS[pxmpNum()][0].length-1 - (G_zoom.y2 - G_zoom.y1);
            G_zoom.y2 = PXMPS[pxmpNum()][0].length-1;
        }
        window.requestAnimationFrame(draw);
    }

    return;
}


docElem("pixMap_num").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});
docElem("resize_x").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});
docElem("resize_y").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});
docElem("width").addEventListener("keypress", function (evt) {
    if (evt.which < 48 || evt.which > 57)
    {
        evt.preventDefault();
    }
});





var GAME_INFO; // Will resolve to that in data.js or undefined
const CVS           = docElem("Canvas_build");
const CXT           = CVS.getContext("2d");

/* Set Defaults */
const DEFAULT_NUMPIX_X         = 1;
const DEFAULT_NUMPIX_Y         = 1;
const DEFAULT_NUMPXMPS         = 1000;
const MAXMAPS                  = 10000;

let PXMPS;

/*Get STATIC_DATA from the data.js file, or initialize a new pixel_map*/
if ( GAME_INFO == undefined ) {
    PXMPS   = init_pixMaps(DEFAULT_NUMPXMPS, DEFAULT_NUMPIX_X, DEFAULT_NUMPIX_Y);
} else {
    PXMPS   = parse_compressed(GAME_INFO);
    document.getElementById("json").value = GAME_INFO;
}
window.P = PXMPS;

/* Globals */
let G_rect          = {x1: 0, y1:0, x2: 0, y2:0, drawing:false };
let G_zoom          = {x1: 0, y1:0, x2: 0, y2:0};

var G_keys          = {};  // cant reset this each time
let G_enabled       = false;
let G_message       = "";
let G_abs_pos       = {x:0, y:0};
let G_stamp         = [];
let G_done_MAP      = [];
let G_undone_MAP    = [];
let G_Prev_MAP      = [0];
let G_overlay = init_pixMap(curMap().length, curMap()[0].length);
// let G_floor_mouse   = false;


const UNDOSIZE      = 50;

/* Initialize the first undo */
G_done_MAP.push( {n:0, mapN:clone(PXMPS[0])});

/* Draw the original Map*/
draw_pixmap(CVS, curMap());
draw_grid(CVS, curMap(), 0.2);
un_zoom();


function zoom_new_map(){

    G_rect.x1 = 0;
    G_rect.x2 = PXMPS[pxmpNum()].length-1;
    G_rect.y1 = 0;
    G_rect.y2 = PXMPS[pxmpNum()][0].length-1;


    G_zoom.x1 = G_rect.x1;
    G_zoom.x2 = G_rect.x2;
    G_zoom.y1 = G_rect.y1;
    G_zoom.y2 = G_rect.y2;

}

function un_zoom() {


    G_rect.x1 += G_zoom.x1;
    G_rect.x2 += G_zoom.x1;
    G_rect.y1 += G_zoom.y1;
    G_rect.y2 += G_zoom.y1;

    G_zoom.x1 = 0;
    G_zoom.x2 = PXMPS[pxmpNum()].length-1;
    G_zoom.y1 = 0;
    G_zoom.y2 = PXMPS[pxmpNum()][0].length-1;
}

function refresh_canvas(){
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), false);
    window.requestAnimationFrame(draw);
}

function curFlag() {
    let f='';
    let i;
    for(i=7; i >= 0; i-- ){
        f += (docElem('F'+(i) ).checked == false) ? 0:1;
    }
    let flag = parseInt(f, 2);

    // console.log("cur flag: " + ReverseString(fmtNumLen((flag).toString(2),8)))
    return flag;
}

function fillCurFlag(flag) {
    let i;
    let flag_str = fmtNumLen((parseInt(flag, 2)).toString(2),8);
    console.log("Fill Cur Flag : " + flag_str);
    for(i=0; i < 8; i ++ ) {
        docElem('F'+(7-i)).checked = (flag_str.charAt(i)=='1');
    }

}



/* I want to limit the draw frequency */
function draw(){

    resizeCanvas();
    CXT.clearRect(0, 0, CVS.width, CVS.height);

    if( docElem("show_flags").checked ){
        draw_pixmap_flagged(CVS, curMap(), curFlag());
            if(docElem("overlay_previous").checked && (pxmpNum()-1 >= 0)) {
            draw_pixmap_flagged(CVS, PXMPS[pxmpNum()-1], curFlag(), 0.5 ) ;
        }
        if(docElem("overlay_next").checked && (pxmpNum()+1 < PXMPS.length) ) {
            draw_pixmap_flagged(CVS, PXMPS[pxmpNum()+1], curFlag(), 0.5) ;
        }

        if(docElem("show_grid").checked) {
            draw_grid(CVS, curMap(), 0.2);
        }

        docElem("info_text").innerHTML = G_message;
        draw_pixmap_flagged(CVS, G_overlay, 0, 10) ;
        draw_pixmap(CVS, G_overlay, 0.6);
        reset_map(G_overlay);

    }else {

        // /* This may be more efficient to draw the image data instead */
        // if( curMap().length <= 1 || curMap()[0].length <= 1) return;
        // let ppm   = export_json_stamp_to_ppm(curMap());
        // let image = PPM_to_ImageData(ppm, CVS);
        // CXT.webkitImageSmoothingEnabled = false;
        // CXT.mozImageSmoothingEnabled = false;
        // CXT.imageSmoothingEnabled = false;

        // let newCanvas = document.getElementById("Canvas_tmp");
        // CXT.scale((CVS.width/image.width),(CVS.height/image.height));
        // newCanvas.getContext("2d").putImageData(image, 0, 0);
        // CXT.drawImage(newCanvas,0,0);
        // CXT.restore();

        // /* Normal Mode */
        draw_pixmap(CVS, curMap()) ;
        if(docElem("overlay_previous").checked && (pxmpNum()-1 >= 0)) {
            draw_pixmap(CVS, PXMPS[pxmpNum()-1], 0.5 ) ;
        }
        if(docElem("overlay_next").checked && (pxmpNum()+1 < PXMPS.length) ) {
            draw_pixmap(CVS, PXMPS[pxmpNum()+1], 0.5) ;
        }

        if(docElem("show_grid").checked) {
            draw_grid(CVS, curMap(), 0.2);
        }

        docElem("info_text").innerHTML = G_message;
        draw_pixmap(CVS, G_overlay, 0.6) ;
        reset_map(G_overlay);

    }

}


function bucket_fill_paint(x , y, pixMap, target_color, new_color, flag) {

    if( target_color == new_color )
        return;
    fill_pixel( {x,y}, pixMap, new_color, flag);
    // let pixPos_temp = pixPos;
    if ( x+1 < curMap().length) {
        let next_color = pixMap[x+1][y][0];
        if( next_color == target_color ){
            bucket_fill_paint(x+1 , y, pixMap, target_color, new_color, flag);
        }
    }
    if ( y+1 < curMap()[0].length ) {
        let next_color = pixMap[x][y+1][0];
        if( next_color == target_color ){
            bucket_fill_paint(x , y+1, pixMap, target_color, new_color, flag);
        }
    }
    if ( x-1 >= 0) {
        let next_color = pixMap[x-1][y][0];
        if( next_color == target_color ){
            bucket_fill_paint(x-1 , y, pixMap, target_color, new_color, flag);
        }
    }
    if ( y-1 >= 0) {
        let next_color = pixMap[x][y-1][0];
        if( next_color == target_color ){
            bucket_fill_paint(x , y-1, pixMap, target_color, new_color, flag);
        }
    }
    return;
}

function bucket_fill_flag(x , y, pixMap, target_flag, new_flag) {
    if( target_flag == new_flag )
        return;
    fill_pixel( {x,y}, pixMap, -1, new_flag);
    // let pixPos_temp = pixPos;
    if ( x+1 < curMap().length) {
        let next_flag = pixMap[x+1][y][1];
        if( next_flag == target_flag ){
            bucket_fill_paint(x+1 , y, pixMap, target_flag, new_flag, flag);
        }
    }
    if ( y+1 < curMap()[0].length ) {
        let next_flag = pixMap[x][y+1][1];
        if( next_flag == target_flag ){
            bucket_fill_paint(x , y+1, pixMap, target_flag, new_flag, flag);
        }
    }
    if ( x-1 >= 0) {
        let next_flag = pixMap[x-1][y][1];
        if( next_flag == target_flag ){
            bucket_fill_paint(x-1 , y, pixMap, target_flag, new_flag, flag);
        }
    }
    if ( y-1 >= 0) {
        let next_flag = pixMap[x][y-1][1];
        if( next_flag == target_flag ){
            bucket_fill_paint(x , y-1, pixMap, target_flag, new_flag, flag);
        }
    }
    return;

}

function ReverseString(str) {

    // Check input
    if(!str || str.length < 2 ||
            typeof str!== 'string') {
        return 'Not valid';
    }

    // Take empty array revArray
    const revArray = [];
    const length = str.length - 1;

    // Looping from the end
    for(let i = length; i >= 0; i--) {
        revArray.push(str[i]);
    }

    // Joining the array elements
    return revArray.join('');
}


function mouse_hover(pixPos){

    let color = docElem("color").value;
    if( color == "-1" ) color = ('FFFFFF');

    /* Dont do anything if in bucket mode */
    if( docElem("bucket").checked ) return;

    if( docElem("stamp").checked ) {
        stamp(pixPos, G_overlay,
            G_stamp,
            docElem("stamp_flip_horiz").checked,
            docElem("stamp_flip_vert").checked,
            docElem("flag_only").checked,
            docElem("paint_only").checked
             );
        return;
    }

    /* Illustrate that a rectanlge is being drawn */
    if( docElem("rectangle").checked  ) {
        color = ('FFFF00');
        if(  G_rect.drawing ){
            draw_pixel_rect(G_overlay, color, {x:G_rect.x1, y:G_rect.y1} , pixPos, -1, false);
            return;
        }
        fill_pixel(pixPos, G_overlay, color);
        return;
    }


    let drawWidth = docElem("width").value;
    if ( drawWidth == "" ) docElem("width").value = 1;
    drawWidth = parseInt(docElem("width").value);

    fill_pixel(pixPos, G_overlay, color, curFlag(), drawWidth, docElem("mirror_horiz").checked, docElem("mirror_vert").checked );

}


function mouse_down(pixPos) {

    if( docElem("stamp").checked ) {
        stamp(pixPos, curMap(),
            G_stamp,
            docElem("stamp_flip_horiz").checked,
            docElem("stamp_flip_vert").checked,
            docElem("flag_only").checked,
            docElem("paint_only").checked );
        return
    }

    if( docElem("dropper").checked ) {
        let flag_at_cursur = curMap()[pixPos.x][pixPos.y][1];
        let color_at_cursur = ( curMap()[pixPos.x][pixPos.y][0] == -1 ) ?  '-1' :  (curMap()[pixPos.x][pixPos.y][0]);
        fillCurFlag(flag_at_cursur);

        docElem("color").value = color_at_cursur;
        let event = new MouseEvent("keyup");
        docElem("color").dispatchEvent(event);

        docElem("dropper").checked = false;
        return;
    }


    let flag  = curFlag();
    let color = docElem("color").value;


    if( docElem("flag_only").checked ) color = "";
    if( docElem("paint_only").checked ) flag = NaN;
    if( docElem("bucket").checked ){
        addMapHistory();
        return bucket_fill_paint(pixPos.x, pixPos.y, curMap(), curMap()[pixPos.x][pixPos.y][0] , color, flag);
    }

    if( docElem("rectangle").checked ) {
        G_rect.x2 = pixPos.x;
        G_rect.y2 = pixPos.y;
        if( G_rect.drawing ) {
            console.log("Finish Rect: x1="+G_rect.x1+", x2="+G_rect.x2+", y1="+G_rect.y1+", y2="+G_rect.y2+")") ;
            G_rect.drawing = false;
            if( G_rect.x1 > G_rect.x2 ) {
                let x1 = G_rect.x1;
                G_rect.x1 = G_rect.x2;
                G_rect.x2 = x1;
            }
            if( G_rect.y1 > G_rect.y2 ) {
                let y1 = G_rect.y1;
                G_rect.y1 = G_rect.y2;
                G_rect.y2 = y1;
            }
            return;
        }
        G_rect.x1=pixPos.x;
        G_rect.y1=pixPos.y;
        console.log("Begining Rect: (" + G_rect.x1 + ", " + G_rect.y1 + ")");
        G_rect.drawing = true;
        return;
    }



    if ( docElem("width").value == "" ) docElem("width").value = 1;
    // console.log("Filling pixel at " + pixPos.x +"," + pixPos.y );
    fill_pixel(pixPos, curMap(), color, flag, parseInt(docElem("width").value), docElem("mirror_horiz").checked, docElem("mirror_vert").checked );

}

/***
 Handle the Mouse in the CVS Area
 */
function mouse(pixPos, down){
    G_enabled = down; // LeftClick is down

    /* set the pos to a mod of 8 if ctrl is down */
    if( G_keys[17] ) {

        let remainder = pixPos.x%8;
        if( remainder > 3 ){
            pixPos.x += (8-remainder-1);
        }else {
            pixPos.x -= remainder;
        }
        remainder = pixPos.y%8;
        if( remainder > 3 ){
            pixPos.y += (8-remainder-1);
        }else {
            pixPos.y -= remainder;
        }
    }

    updateOverlay();

    G_message = "";
    G_message += "Map: " + fmtNumLen(pxmpNum(),2) + ',\t';
    /* If the Cursor is within the map bounds. */
    if( (pixPos.y >= curMap()[0].length  || pixPos.x >= curMap().length || pixPos.x < 0 || pixPos.y < 0 ) ) return;
    G_message += 'Pos(' + fmtNumLen(pixPos.x, 3) + ',' + fmtNumLen(pixPos.y, 3) + '),\t';

    let flag_at_cursur = curMap()[pixPos.x][pixPos.y][1];
    let color_at_cursur = ( curMap()[pixPos.x][pixPos.y][0] == '-1' ) ?  '-1' :  (curMap()[pixPos.x][pixPos.y][0]);
    /* Update the Menu information */
    G_message += 'Flags: ' + ReverseString(fmtNumLen((flag_at_cursur).toString(2),8)) + ',\t';
    G_message += 'Color: ' + color_at_cursur.toUpperCase();


    if(! G_enabled ) return mouse_hover(pixPos);
    return mouse_down(pixPos);

}


function addMapHistory() {
    G_done_MAP.push( {n:pxmpNum(), mapN:clone(PXMPS[pxmpNum()])} ) ;
}


function undo() {

    if(G_done_MAP.length < 1) return;
    if(G_done_MAP.length > UNDOSIZE) G_done_MAP.shift();

    let formerMap;
    let formerMapNum;
    /* make sure that we only undo to the correct map */
    let m = G_done_MAP.length-1;
    for (; m >= 0; m--) {
        formerMapNum = G_done_MAP[m].n;
        if(  formerMapNum == pxmpNum() ){
            // let info = ;
            formerMap = clone(G_done_MAP.splice(m,1)[0].mapN);
            PXMPS[pxmpNum()] = formerMap;
            break;
        }
    }
    if( m < 0 ) return;
    G_undone_MAP.push({n:formerMapNum , mapN: formerMap});
    window.requestAnimationFrame(draw);
    return;
}

function redo() {

    if(G_undone_MAP.length < 1) return;

    let formerMap;
    let formerMapNum;
    /* make sure that we only undo to the correct map */
    let m = G_undone_MAP.length-1;
    for (; m >= 0; m--) {
         formerMapNum = G_undone_MAP[m].n;
        if(  formerMapNum == pxmpNum() ){
            formerMap = clone(G_undone_MAP.splice(m,1)[0].mapN);
            PXMPS[pxmpNum()] = formerMap;
            break;
        }
    }
    if( m < 0 ) return;
    G_done_MAP.push({n:formerMapNum , mapN: formerMap});
    window.requestAnimationFrame(draw);
    return;
}



function pxmpNum() {
    let number = docElem("pixMap_num").value;
    if (number == undefined || number == "") {
        console.log("invalid input the the pixMap_num: " + number + ". Setting to 0");
        docElem("pixMap_num").value = 0;
    }
    return parseInt(number);
}

/* Listeners */

docElem("undo").addEventListener("click", undo);
docElem("redo").addEventListener("click", redo);


/* Mouse movement handled clicking */
CVS.addEventListener('mousemove', function(evt) {
    G_abs_pos = getMousePos(CVS, evt);
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), G_enabled);
    window.requestAnimationFrame(draw);
}, false);

CVS.addEventListener('mousedown',function(evt) {
    G_abs_pos = getMousePos(CVS, evt);
    console.log("mouse is down ");
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), true);
    window.requestAnimationFrame(draw);
}, false);


CVS.addEventListener('mouseup', function(evt) {
    addMapHistory();
    G_abs_pos = getMousePos(CVS, evt);
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), false);
    window.requestAnimationFrame(draw);
}, false);





// switch to another map
docElem("pixMap_num").oninput = function () {

    let curMapNum = pxmpNum();

    if( curMapNum >= PXMPS.length ) {
        if( curMapNum > MAXMAPS ) {
            alert("No map at index " + curMapNum + " and cant resze to " + (curMapNum + 1) + ". Maximum is "  + MAXMAPS);
        }
        if( confirm("Map size out of range. Resize to " + (curMapNum + 1) +"?" ) ) {
            let prev_MAPSIZE = PXMPS.length;
            let new_MAPSIZE  = curMapNum + 1;
            let m;
            for(m=prev_MAPSIZE; m< new_MAPSIZE; m ++ ){
                let new_map = init_pixMap(DEFAULT_NUMPIX_X, DEFAULT_NUMPIX_Y);
                PXMPS.push(new_map);
            }
        } else{
            return;
        }
    }

    if( G_Prev_MAP.length > 2 ) G_Prev_MAP.shift();
    G_Prev_MAP.push(curMapNum);



    zoom_new_map();


    docElem("pixMap_num").value = curMapNum;

    docElem("resize_x").value   = PXMPS[pxmpNum()].length;
    docElem("resize_y").value   = PXMPS[pxmpNum()][0].length;

    // docElem("resize_x").value   = curMap().length;
    // docElem("resize_y").value   = curMap()[0].length;

    /* #p3 I wonder if I have to call things in this order. todo:  */
    resizeCanvas();
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), false)
    window.requestAnimationFrame(draw);

}



docElem("show_grid").oninput = function () {
    // G_showGrid = docElem("show_grid").checked;
    window.requestAnimationFrame(draw);
}

docElem("dropper").oninput = function () {
    if(docElem("dropper").checked){
        docElem("stamp").checked = false;
        docElem("bucket").checked = false;
    }
}

docElem("flag_only").oninput = function () {
    if(docElem("flag_only").checked) {
        docElem("dropper").checked = false;
        docElem("paint_only").checked = false;
        docElem("bucket").checked = false;
    }
}

docElem("paint_only").oninput = function () {
    if(docElem("paint_only").checked) {
        docElem("dropper").checked = false;
        docElem("flag_only").checked = false;
    }
}


docElem("bucket").oninput = function () {
    if (docElem("bucket").checked) {
        docElem("dropper").checked = false;
        docElem("stamp").checked = false;
        docElem("flag_only").checked = false;
        docElem("rectangle").checked = false;

    }
}

docElem("rectangle").oninput = function () {
    if (docElem("rectangle").checked) {
        docElem("stamp").checked = false;
        docElem("dropper").checked = false;
        docElem("bucket").checked = false;
    }
}


docElem("stamp").oninput = function () {
    if (docElem("stamp").checked) {
        docElem("rectangle").checked = false;
        docElem("bucket").checked = false;
        docElem("dropper").checked = false;
    }
}


docElem("copy").onclick = function () {
    G_stamp = clone_slice({x:G_rect.x1+G_zoom.x1, y:G_rect.y1+G_zoom.y1 }, {x:G_rect.x2+G_zoom.x1, y: G_rect.y2+G_zoom.y1}, PXMPS[pxmpNum()]);
    docElem("json").value = JSON.stringify(G_stamp);
}

docElem("fill_rectangle").onclick = function () {
    let color = docElem("color").value;
    let flag = curFlag();
    if( docElem("flag_only").checked ) color = "";
    if( docElem("paint_only").checked ) flag = NaN;
    draw_pixel_rect(curMap(), color,{x:G_rect.x1, y:G_rect.y1 }, {x:G_rect.x2, y: G_rect.y2}, flag, true);
    window.requestAnimationFrame(draw);
}


docElem("previous_map").onclick = function () {
    console.log("previous_map" + G_Prev_MAP);
    let prevMap  = G_Prev_MAP[G_Prev_MAP.length-2];
    docElem("pixMap_num").value = prevMap;
    let event = new MouseEvent("input");
    docElem("pixMap_num").dispatchEvent(event);
    window.requestAnimationFrame(draw);
}

docElem("copy_map").onclick = function () {
    docElem("copy_map_num").value = pxmpNum();
    G_stamp = clone(PXMPS[docElem("copy_map_num").value]);
    docElem("json").value = JSON.stringify(G_stamp);
}

docElem("stamp_map").onclick = function () {
    addMapHistory();
    if( G_stamp.length < 1) return;
    let new_map = init_pixMap(G_stamp.length, G_stamp[0].length);
    stamp({x:0,y:0}, new_map, G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked);
    PXMPS[pxmpNum()] = new_map;

    /* To refresh the canvas correctly  */
    resizeCanvas();
    zoom_new_map();
    refresh_canvas();
    // mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), false)
}


docElem("reset_map").onclick = function (){
    reset_map(PXMPS[pxmpNum()]);
    CXT.clearRect(0,0,CVS.width, CVS.height);
    draw_pixmap(CVS, curMap()) ;
}



docElem("import_sprite").onclick = function (){

    let value = document.getElementById("json").value;
    let lines = value.split("\n");

    if( lines[0].includes("p3") || lines[0].includes("P3") ){
        /*Importing a ppm file */
        console.log("Importing p3 ppm file.")

        let n = 1;
        while( lines[n].includes("#") ) {
            console.log(lines[n]);
            n ++;
        }
        let cols = parseInt(lines[n].split(" ")[0]);
        let rows = parseInt(lines[n].split(" ")[1]);
        n++;
        let maxInt = parseInt(lines[n]);
        n++;

        let y, x, str;
        G_stamp = init_pixMap(cols, rows);
        for(y =0; y < rows; y ++ ){
            for(x =0; x < cols; x ++ ){
                str = fmtNumLen(parseInt(lines[n]).toString(16),2);
                n ++;
                str += fmtNumLen(parseInt(lines[n]).toString(16),2);
                n ++;
                str += fmtNumLen(parseInt(lines[n]).toString(16),2);
                n++;
                G_stamp[x][y][0] = ((str));
            }
        }
        return;
    }

    /* Importing a json string */
    if( value  == '' ) return;
    G_stamp = JSON.parse(value);
}

docElem("resize").onclick = function (){

    addMapHistory();

    let new_x = parseInt(docElem("resize_x").value);
    let new_y = parseInt(docElem("resize_y").value);
    if ( (isNaN(new_x) ) || isNaN(new_y) ) return;
    PXMPS[pxmpNum()] = clone(init_pixMap(new_x, new_y));

    /* To refresh the canvas correctly  */
    resizeCanvas();
    zoom_new_map();
    mouse(get_pixel_pos(G_abs_pos, curMap(), CVS.width, CVS.height), false)
    return;
}

docElem("insert_map").onclick = function() {
    let index = pxmpNum();
    let new_x = parseInt(docElem("resize_x").value);
    let new_y = parseInt(docElem("resize_y").value);
    if ( (isNaN(new_x) ) || isNaN(new_y) ) {
        new_x = 1;
        new_y = 1;
    };
    let new_map = init_pixMap(new_x, new_y);
    console.log("Inserting map at index " + (index));
    PXMPS.splice(index,0, new_map);
    window.requestAnimationFrame(draw);
    return;
}

docElem("remove_map").onclick = function() {
    let index = pxmpNum();
    console.log("Removng map at index " + (index));
    PXMPS.splice(index,1);
    window.requestAnimationFrame(draw);
    return;
}

docElem("overlay_previous").onclick = function() {
    window.requestAnimationFrame(draw);
}

docElem("overlay_next").onclick = function() {
    window.requestAnimationFrame(draw);
}


docElem("show_flags").onclick = function () {
    window.requestAnimationFrame(draw);
    if(docElem("show_flags").checked) {
        console.log("Switching to show flags mode. ");
        return;
    }
    console.log("Switching to normal mode");
}


function zoom_in() {
    G_zoom.x2 = G_rect.x2 + G_zoom.x1;
    G_zoom.x1 = G_rect.x1 + G_zoom.x1;
    G_zoom.y2 = G_rect.y2 + G_zoom.y1;
    G_zoom.y1 = G_rect.y1 + G_zoom.y1;
    G_rect.x1 = 0;
    G_rect.x2 = G_zoom.x2-G_zoom.x1;
    G_rect.y1 = 0;
    G_rect.y2 = G_zoom.y2-G_zoom.y1;
    window.requestAnimationFrame(draw);
    return;
}

docElem("zoom").onclick = function() {
    zoom_in();
    return;
}

docElem("reset_zoom").onclick = function () {
    un_zoom();
    window.requestAnimationFrame(draw);
}

/****
    Creates a new overlay pixmap if it is not the correct size.
*/
function updateOverlay() {

    if ( curMap().length != G_overlay.length  || curMap()[0].length != G_overlay[0].length ) {
        G_overlay = init_pixMap(curMap().length, curMap()[0].length);
        window.requestAnimationFrame(draw);
        return;
    }
    reset_map(G_overlay);
    return;
}

function draw_pixel_rect(pix_map, color, p1, p2, flag, fill=true) {
    let x1 = p1.x;
    let x2 = p2.x;
    let y1 = p1.y;
    let y2 = p2.y;

    if( x2 < x1 ) {
        let x_swap = x1;
        x1  = x2;
        x2 = x_swap;
    }
    if( y2 < y1 ) {
        let y_swap = y1;
        y1  = y2;
        y2 = y_swap;
    }

    let x, y;

    if (fill) {
        for(x=x1; x<=x2; x++) {
            for (y=y1; y<=y2; y++) {
                fill_pixel({x: x,y: y}, pix_map, color, flag);
            }
        }
        return;
    }
    /* Just the outline of the rectanlge. */
    for(x=x1; x<=x2; x++) {
        fill_pixel({x: x,y: y1}, pix_map, color, flag);
        fill_pixel({x: x,y: y2}, pix_map, color, flag);
    }
    for(y=y1; y<=y2; y++) {
        fill_pixel({x: x1,y: y}, pix_map, color, flag);
        fill_pixel({x: x2,y: y}, pix_map, color, flag);
    }

}



function resizeCanvas() {
    let x_px = curMap().length;
    let y_px = curMap()[0].length;
    let scale = (x_px/y_px);
    let y = CVS.height;
    let new_x = (y*scale);
    CVS.width  = new_x;
}

docElem("download_map_as_PPM").onclick = function () {
    G_stamp = clone(curMap());
    let text = export_json_stamp_to_ppm(G_stamp);
    let name = "MAP" + pxmpNum() + ".ppm";
    download(name, text);
}

docElem("download_GAME").onclick = function () {
    let text = "var GAME_INFO = `";
    text +=  JSON.stringify(PXMPS) ;
    text += "`;";
    download('data.js', text);
}

docElem("color_dropdown").onmouseover = function () {
     let color_items = document.getElementById('color_dropdown'), item, i;
     for(i = 0; i < color_items.length; i++) {
       item = color_items[i];
       color_items[i].style.backgroundColor = "#" + color_items[i].value;
    }

}

docElem("color_dropdown").onchange = function () {
    let color_item = document.getElementById('color_dropdown');
    let index = color_item.selectedIndex;
    docElem("color").value = ( color_item[index].value);
    let event = new MouseEvent("keyup");
    docElem("color").dispatchEvent(event);

}

docElem("add_color_to_pallete").onclick = function () {

    let cur_color = docElem("color").value;
    /* Check for duplicated */
    var color_items = document.getElementById('color_dropdown'), color_item, i;
     let colors = '';
    for(i = 0; i < color_items.length; i++) {
        color_item = color_items[i];
        if ( cur_color == color_items[i].value) {
            console.log("Color already in the pallete.");
           return;
        }
    }

    color_items = document.getElementById('color_dropdown');
    var option = document.createElement("option");
    option.text = cur_color;
    option.value = cur_color;

    color_items.add(option,0);
}

docElem("F0").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F1").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F2").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F3").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F4").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F5").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F6").onclick = function () {window.requestAnimationFrame(draw);}
docElem("F7").onclick = function () {window.requestAnimationFrame(draw);}


docElem("remove_color_from_pallete").onclick = function() {
    var x = docElem('color_dropdown');
    x.remove(x.selectedIndex);

}

// docElem

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}


document.getElementById("upload_file").addEventListener("change", function () {
  if (this.files && this.files[0]) {
    var myFile = this.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function (e) {
        document.getElementById("json").value = e.target.result;
        // PXMPS = JSON.parse(document.getElementById("json").value);
        window.requestAnimationFrame(draw);
    });

    reader.readAsBinaryString(myFile);
  }
});


function swap_color(pix_map, old_color, new_color) {
    let numpixels_x = pix_map.length;
    let numpixels_y = pix_map[0].length;
    let i, j, curColor;
    if( old_color == -1 ){
        for (i = 0; i < numpixels_x; i ++ ){
            for (j = 0; j < numpixels_y; j ++ ){
                curColor = pix_map[i][j][0];
                if(curColor == old_color){
                    pix_map[i][j][0] = new_color;
                }
            }
        }
        return;
    }
    let old_colorNum = old_color;
    if( new_color == -1 ){
        for (i = 0; i < numpixels_x; i ++ ){
            for (j = 0; j < numpixels_y; j ++ ){
                curColor = pix_map[i][j][0];
                if(curColor == old_colorNum){
                    pix_map[i][j][0] = new_color;
                }
            }
        }
        return;
    }
    for (i = 0; i < numpixels_x; i ++ ){
        for (j = 0; j < numpixels_y; j ++ ){
            curColor = pix_map[i][j][0];
            if(curColor == old_colorNum){
                pix_map[i][j][0] = new_color;
            }
        }
    }
    return;
}


docElem("swap_color").onclick = function () {
    addMapHistory();
    let old_color = docElem("color").value;
    let new_color = docElem("new_color").value;
    console.log("swapping color " + old_color + " with " + new_color );

    swap_color(PXMPS[pxmpNum()], old_color, new_color);
    window.requestAnimationFrame(draw);
}

function importGameInfo () {
    let text = document.getElementById("json").value;
    PXMPS = parse_compressed(text);
}
document.getElementById("import_GAMEINFO").onclick = importGameInfo;


document.getElementById("import_pallete_hex").onclick = function () {

    let text = document.getElementById("upload").value;
    console.log("Importing hex pallete")
    if(text.includes("[") || text.includes("]")){
        console.log("invalid hex pallete character found. ");
        return;
    }
    let hexColors = text.split("\n");
    let i =0;
    for(i=0; i < hexColors.length; i ++ ) {
        let color_items = document.getElementById('color_dropdown');
        var option = document.createElement("option");
        option.text = hexColors[i];
        option.value = hexColors[i];
        color_items.add(option,0);
    }
    window.requestAnimationFrame(draw);
}

function  add_map_colors_to_pallete (){
    let map = curMap();
    let inPallete=false;
    let x,y,i;
    let color_items = document.getElementById('color_dropdown');
    for (x=0;x < map.length ; x++ ) {
        for (y=0; y < map[0].length; y++ ) {
            inPallete = false;
            let colorNum = map[x][y][0];
            if( colorNum == "-1" ) continue;
            let cur_color = (colorNum);
            for(i=0; i < color_items.length; i++) {
                let color_item = color_items[i];
                if ( cur_color == color_items[i].value) {
                    // console.log("Color already in the pallete.");
                   inPallete = true;
                }
            }
            if( !inPallete ){
                var option = document.createElement("option");
                option.text = cur_color;
                option.value = cur_color;
                color_items.add(option,0);
            }
        }
    }

}

function save() {
    var promise = new Promise(function (resolve, reject){
        let text = export_to_compressed(clone(PXMPS));
        docElem("json").value  = text;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              document.getElementById("info_text").innerHTML = this.responseText;
              console.log(this.responseText);
            }
        };
        var data = new FormData();
        data.append("data" , text);
        xhttp.open("POST", "\save_json", true);
        xhttp.send(data);
        resolve("saved");
        return;
    });
    return promise;
}


docElem("save").onclick = function() {
    save();
}

docElem("decode").onclick = function() {
    console.log("decoding");
    let bmpData = docElem("json").value;
    let decoder = new BmpDecoder(bmpData, true);
}


add_map_colors_to_pallete();
refresh_canvas();


document.onkeydown = document.onkeyup = function(e){
    builder_keypress_fn(e);
    game_keypress_fn(e);
}


}// end MapBuilder.js

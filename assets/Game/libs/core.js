"use strict";
window.SPRITES = [];
window.FLAGS = new Uint8ClampedArray(256);
window.MAPS = [];
let G_PALLETE = [[0, 0, 0, 0], [255, 255, 0, 255]];
let G_TMPCVS = document.getElementById("Canvas_tmp");
let G_TMPCTX = G_TMPCVS.getContext("2d");
function rgbhToHex(rgbh) {
    let hex = "";
    hex += fmtNumLen(rgbh[0].toString(16), 2);
    hex += fmtNumLen(rgbh[1].toString(16), 2);
    hex += fmtNumLen(rgbh[2].toString(16), 2);
    hex += fmtNumLen(rgbh[3].toString(16), 2);
    return hex;
}
function hexToRgbh(hex) {
    if (hex.charAt(0) == "#") {
        hex = hex.substring(1, hex.length - 1);
    }
    let res = [];
    res[0] = parseInt(hex.substring(0, 2), 16);
    res[1] = parseInt(hex.substring(2, 4), 16);
    res[2] = parseInt(hex.substring(4, 6), 16);
    res[3] = parseInt(hex.substring(6, 8), 16);
    if (isNaN(res[3])) {
        res[3] = 255;
    }
    if (hex == "-1")
        return [0, 0, 0, 0];
    if (hex == "FFFF00")
        return [255, 255, 0, 255];
    return res;
}
function round8(x) {
    return Math.floor(x / 8) * 8;
}
function round64(x) {
    return Math.floor(x / 64) * 64;
}
function ReverseString(str) {
    // Check input
    if (!str || str.length < 2 ||
        typeof str !== 'string') {
        return 'Not valid';
    }
    // Take empty array revArray
    const revArray = [];
    const length = str.length - 1;
    // Looping from the end
    for (let i = length; i >= 0; i--) {
        revArray.push(str[i]);
    }
    // Joining the array elements
    return revArray.join('');
}
function round_up_to_eight(x) {
    return (x + 7) & (-8);
}
function clone(object) {
    let string = JSON.stringify(object);
    return JSON.parse(string);
}
function fmtNumLen(num, length) {
    let r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function init_MAP(rows, cols) {
    let map = [];
    for (var row = 0; row < rows; row++) {
        let uintc8 = new Uint8ClampedArray(cols);
        for (var col = 0; col < cols; col++) {
            uintc8[col] = 254;
        }
        map.push(uintc8);
    }
    return map;
}
/*
    let image = CVS.getContext("2d").createImageData(512,128 );
    image.data.set(combineIDhorizontal(MPS[2], MPS[500]));
    MPS[7] = image;

    This does not copy flags !!!
*/
function combineIDhorizontal(ImageData_1, ImageData_2) {
    if (ImageData_2.height > ImageData_1.height) {
        window.console.log("Second ImageData too large, it will be chopped");
        return;
    }
    else if (ImageData_2.height < ImageData_1.height) {
        window.console.log("Second ImageData too small, it will be made transparent in extra space");
        return;
    }
    let rows = ImageData_1.width + ImageData_2.width;
    let cols = ImageData_1.height;
    let ResultimageData = [];
    let y, x, index = 0, i1 = 0, i2 = 0;
    for (y = 0; y < ImageData_1.height; y++) {
        for (x = 0; x < ImageData_1.width * 4; x++) {
            ResultimageData.push(ImageData_1.data[i1]);
            index += 1;
            i1 += 1;
        }
        for (x = 0; x < ImageData_2.width * 4; x++) {
            ResultimageData.push(ImageData_2.data[i2]);
            index += 1;
            i2 += 1;
        }
    }
    let Resultimage = new Uint8ClampedArray(ResultimageData);
    return Resultimage;
}
function get_pixel_pos_img(absPos, MAP, canvaswidth, canvasheight) {
    let pixelwidth = Math.floor(canvaswidth / MAP[0].length);
    let pixelheight = Math.floor(canvasheight / MAP.length);
    let x_abs = absPos.x - absPos.x % pixelwidth;
    let y_abs = absPos.y - absPos.y % pixelheight;
    let x_pix = Math.floor(x_abs / pixelwidth);
    let y_pix = Math.floor(y_abs / pixelheight);
    return { x: x_pix, y: y_pix };
}
function reset_img(map) {
    if (map == undefined) {
        console.log("ERROR: reset_img(map==undefined) -> Not Resetting.");
        return;
    }
    let i = 0;
    let j = 0;
    let numpixels_x = map[0].length;
    let numpixels_y = map.length;
    for (j = 0; j < numpixels_y; j++) {
        for (i = 0; i < numpixels_x; i++) {
            map[j][i] = 0;
        }
    }
}
// function stamp(pixPos, dest, source, flip_horiz=false, flip_vert=false, flag_only=false, paint_only=false, force_empty=false) {
//     let x = Math.floor(pixPos.x);
//     let xi = 0;
//     let numpixels_x = dest.length;
//     let numpixels_y = dest[0].length;
//     for (;xi < source.length ; xi++ ) {
//         let yi = 0;
//         let y = Math.floor(pixPos.y);
//         for (; yi < source[xi].length; yi++ ) {
//             let source_x = xi;
//             let source_y = yi;
//             if ( flip_horiz ) source_x = source.length-xi-1;
//             if ( flip_vert )  source_y = source[0].length-yi-1;
//             if( !( (x < numpixels_x) && (y < numpixels_y) && (x >= 0) && (y >= 0) ) ){
//                 y++;
//                 continue;
//             }
//             let color   = source[source_x][source_y][0];
//             let curFlag = source[source_x][source_y][1];
//             if( color == "-1" && !force_empty) {
//                 color = "";
//             }
//             if( paint_only ) curFlag = NaN;
//             if( flag_only )  color = "";
//             if(flip_horiz) {
//                 fill_pixel({x:x,y:y}, dest, color, curFlag, 1);
//             } else {
//                 fill_pixel({x:x,y:y}, dest, color, curFlag, 1);
//             }
//             y++;
//         }
//         x++;
//     }
// }
function stamp_img(pixPos, dest, source, flip_horiz = false, flip_vert = false, force_empty = false) {
    let numpixels_x = dest[0].length;
    let numpixels_y = dest.length;
    let yi = 0;
    let y = Math.floor(pixPos.y);
    for (; yi < source.length; yi++) {
        let x = Math.floor(pixPos.x);
        let xi = 0;
        let source_y = yi;
        for (; xi < source[0].length; xi++) {
            let source_x = xi;
            if (flip_vert)
                source_x = source[0].length - xi - 1;
            if (flip_horiz)
                source_y = source.length - yi - 1;
            if (!((x < numpixels_x) && (y < numpixels_y) && (x >= 0) && (y >= 0))) {
                x++;
                continue;
            }
            let color_index = source[source_y][source_x];
            if (color_index == 0 && !force_empty) {
                x++;
                continue;
            }
            dest[y][x] = source[source_y][source_x];
            x++;
        }
        y++;
    }
}
function clone_slice(p1, p2, source) {
    let cloned = [];
    if (p1.x > p2.x) {
        let x = p2.x;
        p2.x = p1.x;
        p1.x = x;
    }
    if (p1.y > p2.y) {
        let y = p2.y;
        p2.y = p1.y;
        p1.y = y;
    }
    let x = p1.x;
    for (; x <= p2.x; x++) {
        let y = p1.y;
        let row = [];
        for (; y <= p2.y; y++) {
            let tmp = [];
            Object.assign(tmp, source[x][y]);
            row.push(tmp);
        }
        cloned.push(row);
    }
    return cloned;
}
function clone_img(source, p1 = undefined, p2 = undefined) {
    if (p1 == undefined) {
        p1 = { x: 0, y: 0 };
    }
    if (p2 == undefined) {
        p2 = { x: source[0].length - 1, y: source.length - 1 };
    }
    let cloned = [];
    if (p1.x > p2.x) {
        let x = p2.x;
        p2.x = p1.x;
        p1.x = x;
    }
    if (p1.y > p2.y) {
        let y = p2.y;
        p2.y = p1.y;
        p1.y = y;
    }
    let y = p1.y;
    for (; y <= p2.y; y++) {
        let x = p1.x;
        let row = [];
        for (; x <= p2.x; x++) {
            row.push(source[y][x]);
        }
        cloned.push(row);
    }
    return cloned;
}
function draw_grid(canvas, pix_map, alpha = 1) {
    let cxt = canvas.getContext("2d");
    cxt.globalAlpha = alpha;
    let numpixels_x = pix_map.length;
    let numpixels_y = pix_map[0].length;
    let canvasheight = canvas.height;
    let canvaswidth = canvas.width;
    let pixelwidth = Math.floor(canvaswidth / numpixels_x);
    let pixelheight = Math.floor(canvasheight / numpixels_y);
    let i;
    for (i = 0; i < numpixels_x; i++) {
        if (i % 16 == 0)
            cxt.lineWidth = 3;
        else if (i % 8 == 0)
            cxt.lineWidth = 2;
        else
            cxt.lineWidth = 1;
        cxt.beginPath();
        cxt.moveTo(i * pixelwidth, 0);
        cxt.lineTo(i * pixelwidth, canvasheight);
        cxt.stroke();
    }
    for (i = 0; i < numpixels_y; i++) {
        if (i % 16 == 0)
            cxt.lineWidth = 3;
        else if (i % 8 == 0)
            cxt.lineWidth = 2;
        else
            cxt.lineWidth = 1;
        cxt.beginPath();
        cxt.moveTo(0, i * pixelheight);
        cxt.lineTo(canvaswidth, i * pixelheight);
        cxt.stroke();
    }
    cxt.globalAlpha = 1;
}
/***
    Input flag code
*/
function inmap(x, y, mapNum) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (y < window.MAPS[mapNum].length && x < window.MAPS[mapNum][0].length
        && x >= 0 && y >= 0) {
        return true;
    }
    return false;
}
/***
    Input flag code
*/
function fmap(x, y, mapNum, flag) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (window.FLAGS[window.MAPS[mapNum][y][x]] & ((1 << (flag) >>> 1))) {
        return true;
    }
    return false;
}
function draw_text_info(canvas, gameHeight, text) {
    let cxt = canvas.getContext("2d");
    cxt.clearRect(0, gameHeight, canvas.width, canvas.height - gameHeight);
    let fontSize = Math.floor(canvas.height / 30);
    cxt.font = fontSize + 'pt Calibri';
    cxt.fillStyle = 'black';
    cxt.fillText(text, 2, canvas.height - fontSize - 2);
}
var get_fps = (function () {
    let t_i = new Date();
    let fps = 0;
    let frames = 0;
    return function () {
        frames += 1;
        let t_f = new Date();
        let duration = Number(t_f) - Number(t_i);
        if (duration > 1000) {
            fps = Math.floor(frames / (duration / 1000));
            t_i = new Date();
            frames = 0;
        }
        return fps;
    };
})();
// //colorChannelA and colorChannelB are ints ranging from 0 to 255
// function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
//     var channelA = colorChannelA*amountToMix;
//     var channelB = colorChannelB*(1-amountToMix);
//     return parseInt(channelA+channelB);
// }
// //rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
// //example (red): rgbA = [255,0,0]
// function colorMixer(rgbA, rgbB, amountToMix){
//     var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
//     var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
//     var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
//     return [r,g,b];
//     // return "rgb("+r+","+g+","+b+")";
// }
function CamFolX(x, cvs, mapID, mapID_prev = undefined, mapID_next = undefined) {
    let cxt = cvs.getContext("2d");
    cxt.save();
    let tmpcxt = G_TMPCVS.getContext("2d");
    cxt.scale((cvs.width / mapID.width), (cvs.height / mapID.height));
    tmpcxt.putImageData(mapID, 0, 0);
    cxt.drawImage(G_TMPCVS, (-x) % mapID.width + mapID.width / 2, 0);
    if (mapID_next != undefined) {
        tmpcxt.putImageData(mapID_next, 0, 0);
        cxt.drawImage(G_TMPCVS, (-x) % mapID.width + mapID.width + mapID.width / 2, 0);
    }
    if (mapID_prev != undefined) {
        tmpcxt.putImageData(mapID_prev, 0, 0);
        cxt.drawImage(G_TMPCVS, (-x) % mapID.width - mapID.width + mapID.width / 2, 0);
    }
    cxt.restore();
}
function CamFolXY(x, y, cvs, tmpcvs, mapID, mapID_prev = undefined, mapID_next = undefined) {
    let cxt = cvs.getContext("2d");
    cxt.save();
    let tmpcxt = tmpcvs.getContext("2d");
    cxt.scale((cvs.width / mapID.width), (cvs.height / mapID.height));
    tmpcxt.putImageData(mapID, 0, 0);
    cxt.drawImage(tmpcvs, (-x) % mapID.width + mapID.width / 2, (-y) % mapID.height + mapID.height / 2);
    if (mapID_next != undefined) {
        tmpcxt.putImageData(mapID_next, 0, 0);
        cxt.drawImage(tmpcvs, (-x) % mapID.width + mapID.width + mapID.width / 2, (-y) % mapID.height + mapID.height / 2);
    }
    if (mapID_prev != undefined) {
        tmpcxt.putImageData(mapID_prev, 0, 0);
        cxt.drawImage(tmpcvs, (-x) % mapID.width - mapID.width + mapID.width / 2, (-y) % mapID.height + mapID.height / 2);
    }
    cxt.restore();
}
function CamFolXYZoomed(x, y, scaleFactor, cvs, mapID) {
    let cxt = cvs.getContext("2d");
    cxt.save();
    cxt.scale((cvs.width * scaleFactor / mapID.width), (cvs.height * scaleFactor / mapID.height));
    G_TMPCVS.getContext("2d").putImageData(mapID, -x + mapID.width / 2 / scaleFactor, 0, x - mapID.width / 2 / scaleFactor, 0, mapID.width, mapID.height);
    cxt.drawImage(G_TMPCVS, 0, (-y) % mapID.height + Math.floor(mapID.height / 2 / scaleFactor));
    cxt.restore();
}
function CamStill(cvs, tmpcvs, mapID) {
    let cxt = cvs.getContext("2d");
    cxt.save();
    cxt.scale((cvs.width / mapID.width), (cvs.height / mapID.height));
    tmpcvs.getContext("2d").putImageData(mapID, 0, 0);
    cxt.drawImage(tmpcvs, 0, 0);
    cxt.restore();
}
function draw_rect_img(map, value, p1, p2, fill = true) {
    let x1 = p1.x;
    let x2 = p2.x;
    let y1 = p1.y;
    let y2 = p2.y;
    if (x2 < x1) {
        let x_swap = x1;
        x1 = x2;
        x2 = x_swap;
    }
    if (y2 < y1) {
        let y_swap = y1;
        y1 = y2;
        y2 = y_swap;
    }
    let x, y;
    if (fill) {
        for (y = y1; y <= y2; y++) {
            for (x = x1; x <= x2; x++) {
                if (x < map[0].length && y < map.length) {
                    map[y][x] = value;
                }
            }
        }
        return;
    }
    /* Just the outline of the rectanlge. */
    for (x = x1; x <= x2; x++) {
        map[y1][x] = value;
        map[y2][x] = value;
    }
    for (y = y1; y <= y2; y++) {
        map[y][x1] = value;
        map[y][x2] = value;
    }
}
function bucket_fill(x, y, spr, target_color, new_color) {
    if (target_color == new_color)
        return;
    spr[y][x] = new_color;
    if (x + 1 < spr[0].length) {
        let next_color = spr[y][x + 1];
        if (next_color == target_color) {
            bucket_fill(x + 1, y, spr, target_color, new_color);
        }
    }
    if (y + 1 < spr.length) {
        let next_color = spr[y + 1][x];
        if (next_color == target_color) {
            bucket_fill(x, y + 1, spr, target_color, new_color);
        }
    }
    if (x - 1 >= 0) {
        let next_color = spr[y][x - 1];
        if (next_color == target_color) {
            bucket_fill(x - 1, y, spr, target_color, new_color);
        }
    }
    if (y - 1 >= 0) {
        let next_color = spr[y - 1][x];
        if (next_color == target_color) {
            bucket_fill(x, y - 1, spr, target_color, new_color);
        }
    }
    return;
}
function parse_compressed_img(text) {
    let tmp = text.split("----");
    let SPRInfo = tmp[0];
    let MAPInfo = tmp[1];
    let splitText = SPRInfo.split("\n\n");
    if (!splitText[0].includes("Compressed_GAMEINFO")) {
        console.log("parse_compressed attempting to parse invalid data. ");
        return;
    }
    let pall = JSON.parse(splitText[1]);
    for (var p = 0; p < pall.length; p++) {
        add_color_to_pallete(pall[p]);
    }
    let numberOfSPRITES = splitText[2].split("#")[0];
    let new_SPRS = [];
    let new_FLAGS = [];
    let textIndex = 3;
    for (var i = 0; i < numberOfSPRITES; i++) {
        let numberRows = parseInt(splitText[textIndex].split(" ")[0]);
        let numberCols = parseInt(splitText[textIndex].split(" ")[1]);
        let flags = parseInt(splitText[textIndex].split(" ")[2]);
        let new_SPR = init_SPRITE(numberRows, numberCols);
        let varSplitText = splitText[textIndex].split("\n");
        for (var rows = 1; rows <= numberRows; rows++) {
            let rowSplitText = varSplitText[rows].split(/[\t ]+/);
            for (var cols = 0; cols < numberCols; cols++) {
                let val = parseInt(rowSplitText[cols]);
                new_SPR[rows - 1][cols] = val;
            }
        }
        textIndex++;
        new_FLAGS.push(flags);
        new_SPRS.push((new_SPR));
    }
    splitText = MAPInfo.split("\n\n");
    let numberOfMAPS = splitText[1].split("#")[0];
    let new_MAPS = [];
    textIndex = 2;
    for (var i = 0; i < numberOfMAPS; i++) {
        let numberRows = parseInt(splitText[textIndex].split(" ")[0]);
        let numberCols = parseInt(splitText[textIndex].split(" ")[1]);
        let new_MAP = init_MAP(numberRows, numberCols);
        let varSplitText = splitText[textIndex].split("\n");
        for (var rows = 1; rows <= numberRows; rows++) {
            let rowSplitText = varSplitText[rows].split(/[\t ]+/);
            for (var cols = 0; cols < numberCols; cols++) {
                let val = parseInt(rowSplitText[cols]);
                new_MAP[rows - 1][cols] = val;
            }
        }
        textIndex++;
        new_MAPS.push(new_MAP);
    }
    return [new_SPRS, new_FLAGS, new_MAPS];
}
function add_color_to_pallete(color) {
    /* Check for duplicated */
    let colorRGBH = hexToRgbh(color);
    if (G_PALLETE.length > 255) {
        window.alert("Too many colors in G_PALLETE, limit is 256");
        return;
    }
    for (var i = 0; i < G_PALLETE.length; i++) {
        if (JSON.stringify(colorRGBH) == JSON.stringify(G_PALLETE[i])) {
            console.log("Color already in the G_PALLETE.");
            return;
        }
    }
    G_PALLETE.push(colorRGBH);
    let color_items = document.getElementById('color_dropdown');
    if (color_items != undefined) {
        let color_item;
        color_items = document.getElementById('color_dropdown');
        var option = document.createElement("option");
        option.text = color;
        option.value = color;
        color_items.add(option);
    }
}
function init_SPRITE(rows, cols) {
    let spr = [];
    for (var row = 0; row < rows; row++) {
        let uintc8 = new Uint8ClampedArray(cols);
        spr.push(uintc8);
    }
    return spr;
}
function draw_map(canvas, map, alpha = 1) {
    let context = canvas.getContext("2d");
    context.globalAlpha = alpha;
    let image = context.createImageData(map[0].length * 8, map.length * 8);
    image.data.set(map_to_imagedata(map));
    draw_image(canvas, image);
    context.globalAlpha = 1;
}
function draw_image(canvas, image, scaleW = undefined, scaleH = undefined, x = 0, y = 0, degs = 0, flipX = false, flipY = false, offset = false) {
    let context = canvas.getContext("2d");
    let rads = degs * Math.PI / 180;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    if (scaleW == undefined)
        scaleW = Math.floor(canvas.width / image.width);
    if (scaleH == undefined)
        scaleH = Math.floor(canvas.height / image.height);
    if (flipX) {
        scaleW *= -1;
        x += image.width;
    }
    if (flipY) {
        scaleH *= -1;
        y += image.height;
    }
    context.save();
    if (offset)
        context.translate(x + image.width / 2, y + image.height / 2);
    else
        context.translate(x, y);
    context.scale(scaleW, scaleH);
    context.rotate(rads);
    if (offset)
        context.translate(-image.width / 2, -image.height / 2);
    G_TMPCTX.clearRect(0, 0, G_TMPCVS.width, G_TMPCVS.height);
    G_TMPCTX.putImageData(image, 0, 0);
    context.drawImage(G_TMPCVS, 0, 0);
    context.restore();
}
function map_to_imagedata(map) {
    // let image = ctx.createImageData(map.width, map.height);
    let imageData = new Uint8ClampedArray(map[0].length * map.length * 4 * 8 * 8);
    let index = 0;
    let color;
    var col = map[0].length - 1;
    var row = map.length - 1;
    row: for (; row >= 0; row--) {
        subRow: for (var subRow = 0; subRow < 64; subRow++) {
            col = map[0].length - 1;
            col: for (; col >= 0; col--) {
                let spr = window.SPRITES[map[row][col]];
                subCol: for (var subCol = 0; subCol < 64; subCol++) {
                    let row_ = spr[subRow];
                    if (row_ == undefined) {
                        // subRow = 64;
                        continue col;
                    }
                    let index_ = row_[subCol];
                    if (index_ == undefined) {
                        // subCol = 64;
                        continue col;
                    }
                    color = G_PALLETE[index_];
                    imageData[4 * (row * 64 * 64 + col * 8 + subRow * 64 * 8 + subCol)] = color[0];
                    imageData[4 * (row * 64 * 64 + col * 8 + subRow * 64 * 8 + subCol) + 1] = color[1];
                    imageData[4 * (row * 64 * 64 + col * 8 + subRow * 64 * 8 + subCol) + 2] = color[2];
                    imageData[4 * (row * 64 * 64 + col * 8 + subRow * 64 * 8 + subCol) + 3] = color[3];
                    // }
                    // }
                }
            }
        }
    }
    return imageData;
}
function sprite_to_imagedata(sprite) {
    // let image = ctx.createImageData(sprite.width, sprite.height);
    let imageData = new Uint8ClampedArray(sprite[0].length * sprite.length * 4);
    let index = 0;
    let color;
    var i = 0;
    for (var row = 0; row < sprite.length; row++) {
        for (var col = 0; col < sprite[0].length; col++) {
            let index_ = sprite[row][col];
            color = G_PALLETE[index_];
            imageData[4 * (row * sprite[0].length + col)] = color[0];
            imageData[4 * (row * sprite[0].length + col) + 1] = color[1];
            imageData[4 * (row * sprite[0].length + col) + 2] = color[2];
            imageData[4 * (row * sprite[0].length + col) + 3] = color[3];
            i += 4;
        }
    }
    return imageData;
}
//# sourceMappingURL=core.js.map
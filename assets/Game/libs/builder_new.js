// var P;
// (function() {
//  P = [];
//  console.log("init P " + P );
//  })();
"use strict";
{
    const G_TMPCVS = docElem("Canvas_tmp");
    const G_TMPCTX = G_TMPCVS.getContext("2d");
    const G_UNDOSIZE = 20;
    let G_UPDATED = { maps: false, sprites: false };
    function docElem(name) {
        return document.getElementById(name);
    }
    function color_at_index(index) {
        return G_PALLETE[index];
    }
    function draw_grid(canvas, rows, cols, alpha = 1) {
        let ctx = canvas.getContext("2d");
        ctx.globalAlpha = alpha;
        let canvasheight = canvas.height;
        let canvaswidth = canvas.width;
        let pixelwidth = Math.floor(canvaswidth / rows);
        let pixelheight = Math.floor(canvasheight / cols);
        let i;
        for (i = 0; i < rows; i++) {
            if (i % 16 == 0)
                ctx.lineWidth = 3;
            else if (i % 8 == 0)
                ctx.lineWidth = 2;
            else
                ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(i * pixelwidth, 0);
            ctx.lineTo(i * pixelwidth, canvasheight);
            ctx.stroke();
        }
        for (i = 0; i < cols; i++) {
            if (i % 16 == 0)
                ctx.lineWidth = 3;
            else if (i % 8 == 0)
                ctx.lineWidth = 2;
            else
                ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, i * pixelheight);
            ctx.lineTo(canvaswidth, i * pixelheight);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    function sprNum() {
        let number = docElem("spr_num").value;
        if (number == undefined || number == "") {
            console.log("invalid input the the spr_num: " + number + ". Setting to 0");
            docElem("spr_num").value = 0;
        }
        /* This prevent the user from fiddling with the prrotected sprites . */
        /*else if (parseInt(number) > 253 ) {
            alert("Max sprite number is 253");
            docElem("spr_num").value = 0;
            number = docElem("spr_num").value;
        }*/
        return parseInt(number);
    }
    function mapNum() {
        let number = docElem("map_num").value;
        if (number == undefined || number == "") {
            console.log("invalid input the the map_num: " + number + ". Setting to 0");
            docElem("map_num").value = 0;
        }
        else if (parseInt(number) > (MAPS.length - 1)) {
            // alert("Max map number is " + (MAPS.length-1));
            if (confirm("Max map number is " + (MAPS.length - 1) + ". Add aother map?")) {
                MAPS.push(init_MAP(64, 64));
            }
            docElem("map_num").value = (MAPS.length - 1);
            number = docElem("map_num").value;
        }
        return parseInt(number);
    }
    /*********
    ********
    ********
    ********
    ********
                             Building Scope
    ********
    ********
    ********
    ********
    *********/
    {
        var GAME_INFO; // Will resolve to that in data.js or undefined
        const CVS = docElem("Canvas_build");
        const CTX = CVS.getContext("2d");
        const CVS_flip_book = docElem("Canvas_flip_book");
        const CTX_flip_book = CVS_flip_book.getContext("2d");
        /* Globals */
        let G_rect = { x1: 0, y1: 0, x2: 0, y2: 0, drawing: false };
        let G_ENABLED = false;
        let G_PIXPOS = { x: 0, y: 0 };
        let G_stamp = [];
        let G_done_SPR = [];
        let G_undone_SPR = [];
        let G_keys = {};
        if (GAME_INFO == undefined) {
            for (var i = 0; i < 256; i++) {
                let defX = 8;
                let defY = 8;
                let spr = init_SPRITE(defY, defX);
                window.SPRITES.push(spr);
            }
            for (var i = 0; i < 256; i++) {
                let cols = 64;
                let rows = 64;
                let map = init_MAP(rows, cols);
                window.MAPS.push(map);
            }
        }
        else {
            [window.SPRITES, window.FLAGS, window.MAPS] = parse_compressed_img(GAME_INFO);
            document.getElementById("buffer").value = GAME_INFO;
        }
        let G_overlay = init_SPRITE(currentSpr().length, currentSpr()[0].length);
        function spr_to_imagedata(spr) {
            // let image = ctx.createImageData(spr.width, spr.height);
            let imageData = new Uint8ClampedArray(spr[0].length * spr.length * 4);
            let index = 0;
            for (var row = 0; row < spr.length; row++) {
                for (var col = 0; col < spr[0].length; col++) {
                    let palleteIndex = spr[row][col];
                    let color = color_at_index(palleteIndex);
                    imageData[index++] = color[0];
                    imageData[index++] = color[1];
                    imageData[index++] = color[2];
                    imageData[index++] = color[3];
                }
            }
            return imageData;
        }
        docElem("spr_num").addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });
        docElem("resize_x").addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });
        docElem("resize_y").addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57) {
                evt.preventDefault();
            }
        });
        // function draw_image(image){
        //     CTX.save();
        //     CTX.scale(Math.floor(CVS.width/image.width),Math.floor(CVS.height/image.height));
        //     G_TMPCTX.clearRect(0,0,G_TMPCVS.width, G_TMPCVS.height);
        //     G_TMPCTX.putImageData(image, 0, 0);
        //     CTX.drawImage(G_TMPCVS,  0, 0);
        //     CTX.restore();
        // }
        function draw_spr(spr, alpha = 1, canvas = CVS, context = CTX) {
            context.globalAlpha = alpha;
            let image = context.createImageData(spr[0].length, spr.length);
            image.data.set(spr_to_imagedata(spr));
            draw_image(canvas, image);
            context.globalAlpha = 1;
        }
        function currentSpr() {
            return window.SPRITES[sprNum()];
        }
        function curFlag() {
            let f = '';
            for (var i = 7; i >= 0; i--) {
                f += (docElem('F' + (i)).checked == false) ? 0 : 1;
            }
            let flag = parseInt(f, 2);
            console.log("cur flag: " + ReverseString(fmtNumLen((flag).toString(2), 8)));
            return flag;
        }
        function fillCurFlag(flag) {
            let flag_str = fmtNumLen(flag.toString(2), 8);
            // console.log("Fill Cur Flag : " + flag_str);
            for (var i = 0; i < 8; i++) {
                docElem('F' + (7 - i)).checked = (flag_str.charAt(i) == '1');
            }
        }
        function setFlag() {
            // console.log("Setting flag of map " + sprNum() +  " to " + curFlag());
            window.FLAGS[sprNum()] = curFlag();
        }
        function resizeCanvas(width, height, canvas = CVS) {
            let x_px = width;
            let y_px = height;
            let scale = (x_px / y_px);
            let y = canvas.height;
            let new_x = (y * scale);
            canvas.width = new_x;
            // CTX.webkitImageSmoothingEnabled = false;
            // CTX.mozImageSmoothingEnabled = false;
            // CTX.imageSmoothingEnabled = false;
            // G_TMPCTX.webkitImageSmoothingEnabled = false;
            // G_TMPCTX.mozImageSmoothingEnabled = false;
            // G_TMPCTX.imageSmoothingEnabled = false;
        }
        let prev_time = 0;
        let flip_sprite;
        function flip_book() {
            let flip_speed = parseInt(docElem("flip_book_speed").value, 10);
            let time = Date.now();
            if (time - prev_time > flip_speed) {
                let flip_start = parseInt(docElem("flip_book_start").value, 10);
                let flip_end = parseInt(docElem("flip_book_end").value, 10);
                prev_time = time;
                flip_sprite++;
                if (flip_sprite > flip_end) {
                    flip_sprite = flip_start;
                }
                // docElem("spr_num").value = flip_sprite;
                resizeCanvas(window.SPRITES[flip_sprite][0].length, window.SPRITES[flip_sprite].length, CVS_flip_book);
                CTX_flip_book.clearRect(0, 0, CVS_flip_book.width, CVS_flip_book.height);
                draw_spr(window.SPRITES[flip_sprite], 1, CVS_flip_book, CTX_flip_book);
            }
            return;
        }
        let pixPosPrev = { x: 0, y: 0 };
        function draw() {
            let message = "";
            message = "";
            message += "SPR: " + fmtNumLen(sprNum(), 2) + ',\t';
            /* If the Cursor is within the map bounds. */
            if ((G_PIXPOS.y >= currentSpr().length || G_PIXPOS.x >= currentSpr()[0].length || G_PIXPOS.x < 0 || G_PIXPOS.y < 0)) {
                G_PIXPOS.x = 0;
                G_PIXPOS.y = 0;
            }
            // let index = parseInt(docElem('color_dropdown').selectedIndex);
            let index_atcursor = parseInt(currentSpr()[G_PIXPOS.y][G_PIXPOS.x]);
            let color_atcursor = rgbhToHex(color_at_index(index_atcursor));
            message += 'Pos(' + fmtNumLen(G_PIXPOS.x, 3) + ',' + fmtNumLen(G_PIXPOS.y, 3) + '),\t';
            /* Update the Menu information */
            message += 'Index: ' + fmtNumLen(index_atcursor, 3) + ',\t';
            message += 'Color: ' + color_atcursor.toUpperCase() + ',\t';
            message += 'Flags: ' + ReverseString(fmtNumLen((window.FLAGS[sprNum()]).toString(2), 8)) + ',\t';
            docElem("info_text_sprite").innerHTML = message;
            resizeCanvas(currentSpr()[0].length, currentSpr().length);
            updateOverlay();
            CTX.clearRect(0, 0, CVS.width, CVS.height);
            draw_spr(currentSpr());
            if (docElem("sprite_mode").checked)
                draw_spr(G_overlay, 0.5);
            if (docElem("show_grid").checked)
                draw_grid(CVS, currentSpr()[0].length, currentSpr().length);
        }
        function mouse_hover() {
            reset_img(G_overlay);
            let index = parseInt(docElem('color_dropdown').selectedIndex);
            let index_atcursor = parseInt(currentSpr()[G_PIXPOS.y][G_PIXPOS.x]);
            if (docElem("bucket").checked) {
                G_overlay = clone_img(currentSpr());
                bucket_fill(G_PIXPOS.x, G_PIXPOS.y, G_overlay, index_atcursor, index);
            }
            if (docElem("stamp").checked) {
                stamp_img(G_PIXPOS, G_overlay, G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked, false);
                return;
            }
            /* Illustrate that a rectanlge is being drawn */
            if (docElem("rectangle").checked) {
                let index = 1;
                if (G_rect.drawing) {
                    draw_rect_img(G_overlay, index, { x: G_rect.x1, y: G_rect.y1 }, G_PIXPOS, false);
                    return;
                }
                G_overlay[G_PIXPOS.y][G_PIXPOS.x] = index;
                return;
            }
            G_overlay[G_PIXPOS.y][G_PIXPOS.x] = index;
        }
        // function selectItemByValue(elmnt, value){
        //   for(var i=0; i < elmnt.options.length; i++)
        //   {
        //     if(elmnt.options[i].value === value) {
        //       elmnt.selectedIndex = i;
        //       break;
        //     }
        //   }
        // }
        function mouse_down() {
            if (docElem("stamp").checked) {
                stamp_img(G_PIXPOS, currentSpr(), G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked, false);
                return;
            }
            // console.log("mouse is down at " + G_PIXPOS.x + ", " + G_PIXPOS.y);
            let index = parseInt(docElem('color_dropdown').selectedIndex);
            let index_atcursor = parseInt(currentSpr()[G_PIXPOS.y][G_PIXPOS.x]);
            let color_atcursor = color_at_index(index_atcursor);
            if (docElem("dropper").checked) {
                console.log("dropper");
                let G_PALLETE = docElem('color_dropdown');
                // selectItemByValue(G_PALLETE, color_atcursor);
                G_PALLETE.selectedIndex = index_atcursor;
                docElem("dropper").checked = false;
                return;
            }
            if (docElem("bucket").checked) {
                return bucket_fill(G_PIXPOS.x, G_PIXPOS.y, currentSpr(), index_atcursor, index);
            }
            if (docElem("rectangle").checked) {
                G_rect.x2 = G_PIXPOS.x;
                G_rect.y2 = G_PIXPOS.y;
                if (G_rect.drawing) {
                    console.log("Finish Rect: x1=" + G_rect.x1 + ", x2=" + G_rect.x2 + ", y1=" + G_rect.y1 + ", y2=" + G_rect.y2 + ")");
                    G_rect.drawing = false;
                    if (G_rect.x1 > G_rect.x2) {
                        let x1 = G_rect.x1;
                        G_rect.x1 = G_rect.x2;
                        G_rect.x2 = x1;
                    }
                    if (G_rect.y1 > G_rect.y2) {
                        let y1 = G_rect.y1;
                        G_rect.y1 = G_rect.y2;
                        G_rect.y2 = y1;
                    }
                    return;
                }
                G_rect.x1 = G_PIXPOS.x;
                G_rect.y1 = G_PIXPOS.y;
                console.log("Begining Rect: (" + G_rect.x1 + ", " + G_rect.y1 + ")");
                G_rect.drawing = true;
                return;
            }
            console.log("Filling pixel at " + G_PIXPOS.x + "," + G_PIXPOS.y);
            currentSpr()[G_PIXPOS.y][G_PIXPOS.x] = index;
        }
        /***
         Handle the Mouse in the CVS Area
         */
        function mouse(down) {
            G_ENABLED = down; // LeftClick is down
            docElem("map_mode").checked = false;
            docElem("sprite_mode").checked = true;
            if ((G_PIXPOS.y >= currentSpr().length || G_PIXPOS.x >= currentSpr()[0].length || G_PIXPOS.x < 0 || G_PIXPOS.y < 0))
                return;
            updateOverlay();
            if (!G_ENABLED)
                return mouse_hover(G_PIXPOS);
            return mouse_down(G_PIXPOS);
        }
        function addSprHistory() {
            G_done_SPR.push({ n: sprNum(), sprN: clone_img(currentSpr()) });
            if (G_done_SPR.length > G_UNDOSIZE) {
                G_done_SPR.shift();
            }
        }
        function undo() {
            if (G_done_SPR.length < 1)
                return;
            let formerSpr;
            let formerSprNum;
            /* make sure that we only undo to the correct map */
            let m = G_done_SPR.length - 1;
            for (; m >= 0; m--) {
                formerSprNum = G_done_SPR[m].n;
                if (formerSprNum == sprNum()) {
                    // let info = ;
                    formerSpr = clone_img(G_done_SPR.splice(m, 1)[0].sprN);
                    window.SPRITES[sprNum()] = formerSpr;
                    break;
                }
            }
            if (m < 0)
                return;
            G_undone_SPR.push({ n: formerSprNum, sprN: formerSpr });
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
            return;
        }
        function redo() {
            if (G_undone_SPR.length < 1)
                return;
            let formerSpr;
            let formerSprNum;
            /* make sure that we only undo to the correct map */
            let m = G_undone_SPR.length - 1;
            for (; m >= 0; m--) {
                formerSprNum = G_undone_SPR[m].n;
                if (formerSprNum == sprNum()) {
                    formerSpr = clone_img(G_undone_SPR.splice(m, 1)[0].sprN);
                    window.SPRITES[sprNum()] = formerSpr;
                    break;
                }
            }
            if (m < 0)
                return;
            G_done_SPR.push({ n: formerSprNum, sprN: formerSpr });
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
            return;
        }
        function round_position() {
            /* set the pos to a mod of 8 if ctrl is down */
            if (G_keys.Control) {
                let remainder = G_PIXPOS.x % 8;
                if (remainder > 3) {
                    G_PIXPOS.x += (8 - remainder - 1);
                }
                else {
                    G_PIXPOS.x -= remainder;
                }
                remainder = G_PIXPOS.y % 8;
                if (remainder > 3) {
                    G_PIXPOS.y += (8 - remainder - 1);
                }
                else {
                    G_PIXPOS.y -= remainder;
                }
                if (docElem("stamp").checked) {
                    G_PIXPOS.x = round8(G_PIXPOS.x);
                    G_PIXPOS.y = round8(G_PIXPOS.y);
                }
            }
        }
        /* Listeners */
        docElem("undo").addEventListener("click", undo);
        docElem("redo").addEventListener("click", redo);
        function flip_book_timer() {
            if (docElem("flip_book").checked) {
                flip_book();
            }
            setTimeout(flip_book_timer, 20);
        }
        setTimeout(flip_book_timer, 20);
        function draw_timer() {
            if (pixPosPrev.x != G_PIXPOS.x || pixPosPrev.y != G_PIXPOS.y) {
                G_UPDATED.maps = true;
                G_UPDATED.sprites = true;
                pixPosPrev.x = (G_PIXPOS.x);
                pixPosPrev.y = (G_PIXPOS.y);
            }
            if (G_UPDATED.sprites || docElem("flip_book").checked) {
                window.requestAnimationFrame(draw);
                G_UPDATED.sprites = false;
            }
            setTimeout(draw_timer, 20);
        }
        resizeCanvas(currentSpr()[0].length, currentSpr().length);
        setTimeout(draw_timer, 20);
        G_done_SPR.push({ n: 0, sprN: clone_img(currentSpr()) });
        /* Mouse movement handled clicking */
        CVS.addEventListener('mousemove', function (evt) {
            let absPos = getMousePos(CVS, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, currentSpr(), CVS.width, CVS.height);
            round_position();
            mouse(G_ENABLED);
        }, false);
        CVS.addEventListener('mousedown', function (evt) {
            addSprHistory();
            let absPos = getMousePos(CVS, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, currentSpr(), CVS.width, CVS.height);
            round_position();
            console.log("mouse is down ");
            if (docElem("rectangle").checked) {
                G_rect.x1 = G_PIXPOS.x;
                G_rect.y1 = G_PIXPOS.y;
                console.log("Begining Rect: (" + G_rect.x1 + ", " + G_rect.y1 + ")");
                G_rect.drawing = true;
                return;
            }
            mouse(true);
            window.requestAnimationFrame(draw);
        }, false);
        CVS.addEventListener('mouseup', function (evt) {
            let absPos = getMousePos(CVS, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, currentSpr(), CVS.width, CVS.height);
            round_position();
            if (G_rect.drawing) {
                G_rect.x2 = G_PIXPOS.x;
                G_rect.y2 = G_PIXPOS.y;
                console.log("Finish Rect: x1=" + G_rect.x1 + ", x2=" + G_rect.x2 + ", y1=" + G_rect.y1 + ", y2=" + G_rect.y2 + ")");
                G_rect.drawing = false;
                if (G_rect.x1 > G_rect.x2) {
                    let x1 = G_rect.x1;
                    G_rect.x1 = G_rect.x2;
                    G_rect.x2 = x1;
                }
                if (G_rect.y1 > G_rect.y2) {
                    let y1 = G_rect.y1;
                    G_rect.y1 = G_rect.y2;
                    G_rect.y2 = y1;
                }
                return;
            }
            mouse(false);
            window.requestAnimationFrame(draw);
        }, false);
        // switch to another map
        docElem("spr_num").oninput = function () {
            if (sprNum() >= 256) {
                docElem("spr_num").value = 255;
            }
            else if (sprNum() < 0) {
                docElem("spr_num").value = 0;
            }
            fillCurFlag(window.FLAGS[sprNum()]);
            docElem("resize_x").value = currentSpr()[0].length;
            docElem("resize_y").value = currentSpr().length;
        };
        docElem("flip_book").oninput = function () {
            if (docElem("flip_book").checked == true) {
                let flip_start = parseInt(docElem("flip_book_start").value, 10);
                flip_sprite = flip_start;
                G_UPDATED.sprites = true;
            }
            else {
                CTX_flip_book.clearRect(0, 0, CVS_flip_book.width, CVS_flip_book.height);
            }
        };
        docElem("dropper").oninput = function () {
            if (docElem("dropper").checked) {
                docElem("stamp").checked = false;
                docElem("bucket").checked = false;
                docElem("rectangle").checked = false;
            }
        };
        docElem("bucket").oninput = function () {
            if (docElem("bucket").checked) {
                docElem("dropper").checked = false;
                docElem("stamp").checked = false;
                docElem("rectangle").checked = false;
            }
        };
        docElem("rectangle").oninput = function () {
            if (docElem("rectangle").checked) {
                docElem("stamp").checked = false;
                docElem("dropper").checked = false;
                docElem("bucket").checked = false;
            }
        };
        docElem("stamp").oninput = function () {
            if (docElem("stamp").checked) {
                docElem("rectangle").checked = false;
                docElem("bucket").checked = false;
                docElem("dropper").checked = false;
            }
        };
        docElem("copy").onclick = function () {
            G_stamp = clone_img(currentSpr(), { x: G_rect.x1, y: G_rect.y1 }, { x: G_rect.x2, y: G_rect.y2 });
        };
        // docElem("draw_rectangle").onclick = function () {
        //     addSprHistory();
        //     let index = parseInt(docElem('color_dropdown').selectedIndex);
        //     draw_rect_img(currentSpr(), index,{x:G_rect.x1, y:G_rect.y1 }, {x:G_rect.x2, y: G_rect.y2}, docElem("fill_rectangle").checked);
        // }
        docElem("copy_this").onclick = function () {
            window.console.log("copying sprite");
            G_stamp = clone_img(currentSpr());
        };
        docElem("stamp_replace").onclick = function () {
            addSprHistory();
            if (G_stamp.length < 1)
                return;
            let new_spr = init_SPRITE(G_stamp.length, G_stamp[0].length);
            stamp_img({ x: 0, y: 0 }, new_spr, G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked, true);
            window.SPRITES[sprNum()] = new_spr;
        };
        docElem("reset_this").onclick = function () {
            window.SPRITES[sprNum()] = init_SPRITE(currentSpr().length, currentSpr()[0].length);
            window.FLAGS[sprNum()] = 0;
        };
        docElem("resize").onclick = function () {
            addSprHistory();
            let new_x = parseInt(docElem("resize_x").value);
            let new_y = parseInt(docElem("resize_y").value);
            if (new_x > 64) {
                window.alert("width is too large, max is 64 ");
                new_x = 64;
                docElem("resize_x").value = 64;
            }
            if (new_y > 64) {
                window.alert("height is too large, max is 64 ");
                new_y = 64;
                docElem("resize_y").value = 64;
            }
            if ((isNaN(new_x)) || isNaN(new_y))
                return;
            window.SPRITES[sprNum()] = init_SPRITE(new_y, new_x);
        };
        /****
            Creates a new overlay pixmap if it is not the correct size.
        */
        function updateOverlay() {
            if (currentSpr()[0].length != G_overlay[0].length || currentSpr().length != G_overlay.length) {
                G_overlay = init_SPRITE(currentSpr().length, currentSpr()[0].length);
                return;
            }
            return;
        }
        docElem("download_GAME").onclick = function () {
            let text = export_to_compressed_img();
            text = "var GAME_INFO =`" + text + "`;";
            download('data.js', text);
        };
        docElem("color_dropdown").onmouseover = function () {
            let color_items = document.getElementById('color_dropdown'), item, i;
            for (i = 0; i < color_items.length; i++) {
                item = color_items[i];
                color_items[i].style.backgroundColor = "#" + color_items[i].value;
            }
        };
        docElem("color_dropdown").onchange = function () {
            let color_item = document.getElementById('color_dropdown');
            let index = color_item.selectedIndex;
            docElem("color").value = (color_item[index].value);
            let event = new MouseEvent("keyup");
            docElem("color").dispatchEvent(event);
        };
        docElem("add_color_to_pallete").onclick = function () {
            let color = docElem("color").value;
            add_color_to_pallete(color);
        };
        docElem("swap_color_in_pallete").onclick = function () {
            let index = docElem('color_dropdown').selectedIndex;
            if (index == 0 || index == 1) {
                window.alert("Cannot swap colors at index 0 or 1");
                return;
            }
            let dropDown = docElem('color_dropdown');
            let option = dropDown[index];
            let new_color = docElem("color").value;
            let colorRGBH = hexToRgbh(new_color);
            G_PALLETE[index] = colorRGBH;
            option.value = new_color;
            option.innerHTML = new_color;
        };
        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        // function save() {
        //     var promise = new Promise(function (resolve, reject){
        //         let text = export_to_compressed_img();
        //         docElem("buffer").value  = text;
        //         var xhttp = new XMLHttpRequest();
        //         xhttp.onreadystatechange = function() {
        //             if (this.readyState == 4 && this.status == 200) {
        //               document.getElementById("info_text_sprite").innerHTML = this.responseText;
        //               console.log(this.responseText);
        //             }
        //         };
        //         var data = new FormData();
        //         data.append("data" , text);
        //         xhttp.open("POST", "\save", true);
        //         xhttp.send(data);
        //         resolve("saved");
        //         console.log("Saved");
        //         return;
        //     });
        //     return promise;
        // }
        function save() {
            let text = export_to_compressed_img();
            docElem("buffer").value = text;
            let ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.send('saveData', text);
        }
        docElem("save").onclick = function () {
            console.log("saving");
            save();
        };
        function export_to_compressed_img() {
            let text = "\n\n";
            text += window.SPRITES.length + " #number of SPR";
            text += "\n\n";
            let i = 0;
            for (; i < window.SPRITES.length; i++) {
                text += window.SPRITES[i].length + " " + window.SPRITES[i][0].length + " " + window.FLAGS[i] + " # rows cols flags of Sprite " + i + " \n";
                let col = 0;
                for (; col < window.SPRITES[i].length; col++) {
                    let row = 0;
                    for (; row < window.SPRITES[i][0].length; row++) {
                        let index = window.SPRITES[i][col][row];
                        text += index + "\t";
                    }
                    text += "\n";
                }
                text += "\n";
            }
            text += "\n----\n\n";
            text += window.MAPS.length + " #number of MAPS";
            text += "\n\n";
            i = 0;
            for (; i < window.MAPS.length; i++) {
                text += window.MAPS[i].length + " " + window.MAPS[i][0].length + " # rows cols of MAP  " + i + " \n";
                let col = 0;
                for (; col < window.MAPS[i].length; col++) {
                    let row = 0;
                    for (; row < window.MAPS[i][0].length; row++) {
                        let index = window.MAPS[i][col][row];
                        text += index + "\t";
                    }
                    text += "\n";
                }
                text += "\n";
            }
            let colors = docElem('color_dropdown');
            let colorObj = [];
            for (var j = 0; j < colors.length; j++) {
                colorObj.push(colors[j].value);
            }
            text = '\n\n' + JSON.stringify(colorObj) + text;
            text = "# Compressed_GAMEINFO" + text;
            return text;
        }
        document.getElementById("import_pallete_hex").onclick = function () {
            let text = document.getElementById("buffer").value;
            console.log("Importing hex G_PALLETE");
            if (text.includes("[") || text.includes("]")) {
                console.log("invalid hex G_PALLETE character found. ");
                return;
            }
            let hexColors = text.split("\n");
            for (var i = 0; i < hexColors.length; i++) {
                if (hexColors[i].length < 6)
                    continue;
                add_color_to_pallete(hexColors[i]);
            }
        };
        docElem("F0").onclick = function () { setFlag(); };
        docElem("F1").onclick = function () { setFlag(); };
        docElem("F2").onclick = function () { setFlag(); };
        docElem("F3").onclick = function () { setFlag(); };
        docElem("F4").onclick = function () { setFlag(); };
        docElem("F5").onclick = function () { setFlag(); };
        docElem("F6").onclick = function () { setFlag(); };
        docElem("F7").onclick = function () { setFlag(); };
        /*
            The following are functions used
            outside of the SPRITE scope
            but must use SPRITE scoped functions
        */
        var spr_keypress_fn = function (e) {
            e = e || event; // to deal with IE
            G_keys = {}; // cant reset this each time
            G_keys[e.key] = e.type == 'keydown';
            if (G_keys.S) {
                let event = new MouseEvent("click");
                docElem("stamp_replace").dispatchEvent(event);
                return;
            }
            if (G_keys.C) {
                let event = new MouseEvent("click");
                docElem("copy_this").dispatchEvent(event);
                return;
            }
            if (G_keys.c) {
                let event = new MouseEvent("click");
                docElem("copy").dispatchEvent(event);
                return;
            }
            if (G_keys.f) {
                addSprHistory();
                let index = parseInt(docElem('color_dropdown').selectedIndex);
                draw_rect_img(currentSpr(), index, { x: G_rect.x1, y: G_rect.y1 }, { x: G_rect.x2, y: G_rect.y2 }, docElem("fill_rectangle").checked);
            }
            /*  Z */
            if (G_keys.z) {
                undo();
                return;
            }
            /*  U */
            if (G_keys.u) {
                redo();
                return;
            }
            /*  O */
            if (G_keys.o) {
                let event = new MouseEvent("click");
                docElem("reset_this").dispatchEvent(event);
                return;
            }
            return;
        };
    } // end SPRITE scope
    /*********
    ********
    ********
    ********
    ********
                            MAP scope
    ********
    ********
    ********
    ********
    *********/
    {
        let CVS_MAP = docElem("Canvas_map");
        let CTX_MAP = CVS_MAP.getContext("2d");
        let G_ENABLED = false; // LeftClick is down
        let G_rect = { x1: 0, y1: 0, x2: 0, y2: 0, drawing: false };
        let G_PIXPOS = { x: 0, y: 0 };
        let G_overlay = [];
        let G_stamp = [];
        let G_keys = {};
        let G_done_MAP = [];
        let G_undone_MAP = [];
        for (var i = 0; i < 64; i++) {
            let row = [];
            for (var j = 0; j < 64; j++) {
                row.push(254);
            }
            G_overlay.push(row);
        }
        /* FIll the eraser */
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                window.SPRITES[254][i][j] = 0;
            }
        }
        /*Fill the highlighter */
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                window.SPRITES[255][i][j] = 1;
            }
        }
        function addMapHistory() {
            G_done_MAP.push({ n: mapNum(), mapN: clone_img(window.MAPS[mapNum()]) });
            if (G_done_MAP.length > G_UNDOSIZE) {
                G_done_MAP.shift();
            }
        }
        function undo() {
            if (G_done_MAP.length < 1)
                return;
            console.log("undoing");
            let formerMAP;
            let formerMAPNum;
            /* make sure that we only undo to the correct map */
            let m = G_done_MAP.length - 1;
            for (; m >= 0; m--) {
                formerMAPNum = G_done_MAP[m].n;
                if (formerMAPNum == mapNum()) {
                    formerMAP = clone_img(G_done_MAP.splice(m, 1)[0].mapN);
                    window.MAPS[mapNum()] = formerMAP;
                    break;
                }
            }
            if (m < 0)
                return;
            G_undone_MAP.push({ n: formerMAPNum, mapN: formerMAP });
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
            return;
        }
        function redo() {
            if (G_undone_MAP.length < 1)
                return;
            let formerMAP;
            let formerMAPNum;
            /* make sure that we only undo to the correct map */
            let m = G_undone_MAP.length - 1;
            for (; m >= 0; m--) {
                formerMAPNum = G_undone_MAP[m].n;
                if (formerMAPNum == mapNum()) {
                    formerMAP = clone_img(G_undone_MAP.splice(m, 1)[0].mapN);
                    window.MAPS[mapNum()] = formerMAP;
                    break;
                }
            }
            if (m < 0)
                return;
            G_done_MAP.push({ n: formerMAPNum, mapN: formerMAP });
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
            return;
        }
        function reset_map(map) {
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[0].length; j++) {
                    map[i][j] = 254; // which is the empty sprite
                }
            }
        }
        let pixPosPrev = { x: 0, y: 0 };
        function draw() {
            let message = "";
            message += "MAP: " + fmtNumLen(mapNum(), 2) + ',\t'; // FIXME
            /* If the Cursor is within the map bounds. */
            if ((G_PIXPOS.y >= 64 || G_PIXPOS.x >= 64 || G_PIXPOS.x < 0 || G_PIXPOS.y < 0)) {
                G_PIXPOS.x = 0;
                G_PIXPOS.y = 0;
            }
            let sprite_at_cursor = parseInt(window.MAPS[mapNum()][G_PIXPOS.y][G_PIXPOS.x]);
            message += 'Pos(' + fmtNumLen(G_PIXPOS.x, 3) + ',' + fmtNumLen(G_PIXPOS.y, 3) + '),\t';
            message += 'Sprite: ' + fmtNumLen(sprite_at_cursor, 3) + ',\t';
            docElem("info_text_map").innerHTML = message;
            CTX_MAP.clearRect(0, 0, CVS_MAP.width, CVS_MAP.height);
            draw_map(CVS_MAP, window.MAPS[mapNum()]);
            if (docElem("map_mode").checked)
                draw_map(CVS_MAP, G_overlay, 0.5);
            if (docElem("show_grid").checked)
                draw_grid(CVS_MAP, 64, 64);
        }
        function draw_timer() {
            if (pixPosPrev.x != G_PIXPOS.x || pixPosPrev.y != G_PIXPOS.y) {
                G_UPDATED.maps = true;
                G_UPDATED.sprites = true;
                pixPosPrev.x = (G_PIXPOS.x);
                pixPosPrev.y = (G_PIXPOS.y);
            }
            if (G_UPDATED.maps) {
                window.requestAnimationFrame(draw);
                G_UPDATED.maps = false;
            }
            setTimeout(draw_timer, 20);
        }
        setTimeout(draw_timer, 20);
        function mouse_hover() {
            reset_map(G_overlay);
            let sprite_at_cursor = parseInt(window.MAPS[mapNum()][G_PIXPOS.y][G_PIXPOS.x]);
            if (docElem("bucket").checked) {
                G_overlay = clone_img(window.MAPS[mapNum()]);
                bucket_fill(G_PIXPOS.x, G_PIXPOS.y, G_overlay, sprite_at_cursor, sprNum());
            }
            if (docElem("stamp").checked) {
                stamp_img(G_PIXPOS, G_overlay, G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked, false);
                return;
            }
            if (docElem("rectangle").checked) {
                let index = 255;
                if (G_rect.drawing) {
                    draw_rect_img(G_overlay, index, { x: G_rect.x1, y: G_rect.y1 }, G_PIXPOS, false);
                    return;
                }
                G_overlay[G_PIXPOS.y][G_PIXPOS.x] = 255;
                return;
            }
            G_overlay[G_PIXPOS.y][G_PIXPOS.x] = sprNum();
        }
        function mouse_down() {
            if (docElem("stamp").checked) {
                stamp_img(G_PIXPOS, window.MAPS[mapNum()], G_stamp, docElem("stamp_flip_horiz").checked, docElem("stamp_flip_vert").checked, false);
                return;
            }
            let sprite_at_cursor = parseInt(window.MAPS[mapNum()][G_PIXPOS.y][G_PIXPOS.x]);
            if (docElem("dropper").checked) {
                console.log("dropper");
                docElem("spr_num").value = sprite_at_cursor;
                docElem("dropper").checked = false;
                return;
            }
            if (docElem("bucket").checked) {
                return bucket_fill(G_PIXPOS.x, G_PIXPOS.y, window.MAPS[mapNum()], sprite_at_cursor, sprNum());
            }
            /* This fills the background of sprites that are larger than 8 x 8 with the eraser sprite .. s*/
            // if( (window.SPRITES[sprNum()].length > 8) || (window.SPRITES[sprNum()][0].length > 8) ) {
            //     let colsRequired = Math.floor(window.SPRITES[sprNum()][0].length/8)-1;
            //     let rowsRequired = Math.floor(window.SPRITES[sprNum()].length/8)-1;
            //     draw_rect_img(window.MAPS[mapNum()], 254, {x:G_PIXPOS.x, y:G_PIXPOS.y }, {x:G_PIXPOS.x+colsRequired, y: G_PIXPOS.y+rowsRequired}, true);
            // }
            window.MAPS[mapNum()][G_PIXPOS.y][G_PIXPOS.x] = sprNum();
        }
        function mouse(down) {
            G_ENABLED = down;
            docElem("map_mode").checked = true;
            docElem("sprite_mode").checked = false;
            if ((G_PIXPOS.y >= 64 || G_PIXPOS.x >= 64 || G_PIXPOS.x < 0 || G_PIXPOS.y < 0))
                return;
            if (!G_ENABLED)
                return mouse_hover();
            return mouse_down();
        }
        function round_position() {
            /* set the pos to a mod of 8 if ctrl is down */
            if (G_keys.Control) {
                let remainder = G_PIXPOS.x % 8;
                if (remainder > 3) {
                    G_PIXPOS.x += (8 - remainder - 1);
                }
                else {
                    G_PIXPOS.x -= remainder;
                }
                remainder = G_PIXPOS.y % 8;
                if (remainder > 3) {
                    G_PIXPOS.y += (8 - remainder - 1);
                }
                else {
                    G_PIXPOS.y -= remainder;
                }
                if (docElem("stamp").checked) {
                    G_PIXPOS.x = round8(G_PIXPOS.x);
                    G_PIXPOS.y = round8(G_PIXPOS.y);
                }
            }
        }
        CVS_MAP.addEventListener('mousedown', function (evt) {
            addMapHistory();
            let absPos = getMousePos(CVS_MAP, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, window.MAPS[mapNum()], CVS_MAP.width, CVS_MAP.height);
            // console.log("mouse is down in CVS_MAP at pos " + pixPos.x + ", " + pixPos.y);
            round_position();
            if (docElem("rectangle").checked) {
                G_rect.x1 = G_PIXPOS.x;
                G_rect.y1 = G_PIXPOS.y;
                console.log("Begining Rect: (" + G_rect.x1 + ", " + G_rect.y1 + ")");
                G_rect.drawing = true;
                return;
            }
            mouse(true);
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
        }, false);
        /* Mouse movement handled clicking */
        CVS_MAP.addEventListener('mousemove', function (evt) {
            let absPos = getMousePos(CVS_MAP, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, window.MAPS[mapNum()], CVS_MAP.width, CVS_MAP.height);
            round_position();
            mouse(G_ENABLED);
        }, false);
        CVS_MAP.addEventListener('mouseup', function (evt) {
            let absPos = getMousePos(CVS_MAP, evt);
            G_PIXPOS = get_pixel_pos_img(absPos, window.MAPS[mapNum()], CVS_MAP.width, CVS_MAP.height);
            // console.log("mouse is up in CVS_MAP at pos " + pixPos.x + ", " + pixPos.y);
            round_position();
            if (G_rect.drawing) {
                G_rect.x2 = G_PIXPOS.x;
                G_rect.y2 = G_PIXPOS.y;
                console.log("Finish Rect: x1=" + G_rect.x1 + ", x2=" + G_rect.x2 + ", y1=" + G_rect.y1 + ", y2=" + G_rect.y2 + ")");
                G_rect.drawing = false;
                if (G_rect.x1 > G_rect.x2) {
                    let x1 = G_rect.x1;
                    G_rect.x1 = G_rect.x2;
                    G_rect.x2 = x1;
                }
                if (G_rect.y1 > G_rect.y2) {
                    let y1 = G_rect.y1;
                    G_rect.y1 = G_rect.y2;
                    G_rect.y2 = y1;
                }
                return;
            }
            mouse(false);
            G_UPDATED.maps = true;
            G_UPDATED.sprites = true;
        }, false);
        /*
            The following are functions used
            outside of the SPRITE scope
            but must use SPRITE scoped functions
        */
        var map_keypress_fn = function (e) {
            console.log("map_mode keypress");
            e = e || event; // to deal with IE
            G_keys = {}; // cant reset this each time
            G_keys[e.key] = e.type == 'keydown';
            if (G_keys.c) {
                G_stamp = clone_img(window.MAPS[mapNum()], { x: G_rect.x1, y: G_rect.y1 }, { x: G_rect.x2, y: G_rect.y2 });
                return;
            }
            if (G_keys.f) {
                addMapHistory();
                draw_rect_img(window.MAPS[mapNum()], sprNum(), { x: G_rect.x1, y: G_rect.y1 }, { x: G_rect.x2, y: G_rect.y2 }, docElem("fill_rectangle").checked);
                G_UPDATED.maps = true;
                G_UPDATED.sprites = true;
                return;
            }
            /*  Z */
            if (G_keys.z) {
                undo();
                return;
            }
            /*  U */
            if (G_keys.u) {
                redo();
                return;
            }
            return;
        };
    } /* End MAP scope */
    /*********
    ********
    ********
    ********
    ********
                            Global Scope
    ********
    ********
    ********
    ********
    *********/
    document.onkeydown = document.onkeyup = function (e) {
        e = e || event; // to deal with IE
        let keys = {}; // cant reset this each time
        keys[e.key] = e.type == 'keydown';
        G_UPDATED.maps = true;
        G_UPDATED.sprites = true;
        if (keys.e) {
            let curspr = sprNum();
            curspr += 1;
            if (curspr >= window.SPRITES.length || curspr < 0)
                return;
            docElem("spr_num").value = curspr;
            let event = new MouseEvent("input");
            docElem("spr_num").dispatchEvent(event);
            return;
        }
        if (keys.w) {
            let curspr = sprNum();
            curspr -= 1;
            if (curspr >= window.SPRITES.length || curspr < 0)
                return;
            docElem("spr_num").value = curspr;
            let event = new MouseEvent("input");
            docElem("spr_num").dispatchEvent(event);
            return;
        }
        if (keys.E) {
            let curspr = mapNum();
            curspr += 1;
            if (curspr >= window.SPRITES.length - 2 || curspr < 0)
                return;
            docElem("map_num").value = curspr;
            let event = new MouseEvent("input");
            docElem("map_num").dispatchEvent(event);
            return;
        }
        if (keys.W) {
            let curspr = mapNum();
            curspr -= 1;
            if (curspr >= window.SPRITES.length - 2 || curspr < 0)
                return;
            docElem("map_num").value = curspr;
            let event = new MouseEvent("input");
            docElem("map_num").dispatchEvent(event);
            return;
        }
        if (keys.s) {
            let event = new MouseEvent("click");
            docElem("stamp").dispatchEvent(event);
            return;
        }
        if (keys.d) {
            docElem("dropper").checked = !docElem("dropper").checked;
            let event = new MouseEvent("input");
            docElem("dropper").dispatchEvent(event);
            return;
        }
        /*  G */
        if (keys.g) {
            docElem("show_grid").checked = !docElem("show_grid").checked;
            let event = new MouseEvent("input");
            docElem("show_grid").dispatchEvent(event);
            return;
        }
        if (keys.b) {
            docElem("bucket").checked = !docElem("bucket").checked;
            let event = new MouseEvent("input");
            docElem("bucket").dispatchEvent(event);
            return;
        }
        if (keys.t) {
            docElem("rectangle").checked = !docElem("rectangle").checked;
            let event = new MouseEvent("input");
            docElem("rectangle").dispatchEvent(event);
            return;
        }
        if (docElem("sprite_mode").checked)
            spr_keypress_fn(e);
        if (docElem("map_mode").checked)
            map_keypress_fn(e);
    };
    window.addEventListener("keydown", function (e) {
        // space and arrow keys
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);
} /* End global scope */
//# sourceMappingURL=builder_new.js.map
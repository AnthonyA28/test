/**
 * Defined in other files
 * */
var MAPS;
var SPRITES;
var SPRIMAGES;
var MAPIMAGES;
var FLAGS;
class Game {
    constructor(canvas) {
        this.SPRITES = SPRITES;
        this.FLAGS = FLAGS;
        this.MAPS = MAPS;
        this.CVS = document.getElementById(canvas);
        this.CTX = this.CVS.getContext("2d");
        this.CTX.webkitImageSmoothingEnabled = false;
        this.CTX.mozImageSmoothingEnabled = false;
        this.CTX.imageSmoothingEnabled = false;
        this.MAPIMAGES = [];
        this.SPRIMAGES = [];
        this.prevDraw = 0;
        this.fps = 30;
        this.now = 0;
        this.endGame = false;
        this.gameInProgress = false;
        this.keysPrev = [];
        this.keysDown = [];
    }
    ;
    pre_parse() {
        console.log("Running default pre_parse function ");
    }
    ;
    init() {
        console.log("Running default init function ");
    }
    ;
    draw() {
        console.log("Running default draw function ");
    }
    ;
    update(time) {
        console.log("Running default update function ");
    }
    ;
    keyClicked(key) {
        console.log("Default keyclicked function ");
    }
    keypress(e) {
        e = e || event; // to deal with IE
        this.keysDown[e.keyCode] = e.type == 'keydown';
        let k;
        let keysClicked = [];
        for (k = 0; k < this.keysDown.length; k++) {
            keysClicked[k] = ((this.keysDown[k] != this.keysPrev[k]) && (this.keysDown[k]));
            this.keysPrev[k] = this.keysDown[k];
        }
        this.keyClicked(keysClicked);
    }
    ;
    init_info() {
        let INIT_RESULT = true;
        if (GAME_INFO === '' || GAME_INFO === undefined) {
            INIT_RESULT = false;
            window.alert("ERROR: NO GAME INFORMATION! Ensure valid game information is encoded in JSON in 'data.js'");
            return INIT_RESULT;
        }
        [window.SPRITES, window.FLAGS, window.MAPS] = parse_compressed_img(GAME_INFO);
        this.pre_parse();
        window.MAPIMAGES = [];
        window.SPRIMAGES = [];
        for (var i = 0; i < window.MAPS.length; i++) {
            let map = window.MAPS[i];
            let image = this.CTX.createImageData(map[0].length * 8, map.length * 8);
            image.data.set(map_to_imagedata(map));
            window.MAPIMAGES.push(image);
        }
        for (var i = 0; i < window.SPRITES.length; i++) {
            let sprite = window.SPRITES[i];
            let image = this.CTX.createImageData(sprite[0].length, sprite.length);
            image.data.set(sprite_to_imagedata(sprite));
            window.SPRIMAGES.push(image);
        }
        return INIT_RESULT;
    }
    ;
    wait() {
        console.log("Waiting for game to conclude");
        this.endGame = true;
        let reqAnimFrame;
        if (this.gameInProgress === true) {
            // cancelAnimationFrame(reqAnimFrame);
            setTimeout(() => this.wait(), 10);
        }
        else {
            this.init();
            this.endGame = false;
            this.gameInProgress = true;
            reqAnimFrame = window.requestAnimationFrame(() => this.loop());
            return;
        }
    }
    start() {
        let reqAnimFrame;
        if (this.init_info()) {
            /* Check if game is running. Wait for it to finish if it is */
            if (this.gameInProgress === false) {
                this.init();
                /* If the game was already in progress destroy the animation frame. */
                cancelAnimationFrame(reqAnimFrame);
                this.endGame = false;
                this.gameInProgress = true;
                reqAnimFrame = window.requestAnimationFrame(() => this.loop());
            }
            else {
                setTimeout(() => this.wait(), 1);
            }
        }
        else {
            console.log("startGame, failed to init_info()");
            return;
        }
    }
    ;
    loop() {
        this.now = Date.now();
        if (this.now - this.prevDraw > 1000 / this.fps) {
            this.prevDraw = this.now;
            this.update(this.now);
            window.requestAnimationFrame(() => this.draw());
        }
        if (!this.endGame) {
            setTimeout(() => this.loop(), 5);
        }
        else {
            this.gameInProgress = false;
            console.log("Ending Game");
            return;
        }
    }
    ;
}
//# sourceMappingURL=gamecore.js.map
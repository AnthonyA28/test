"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _lastSprFlip, _lastSprFlip_1, _lastSprFlip_2, _carrying, _jumping, _jumpStartTime;
let g = new Game("Canvas");
onkeydown = onkeyup = function (e) { g.keypress(e); };
/****
 Global letiables.
 **/
let CURMAP = 0;
let SCALEW;
let SCALEH;
let PAUSED = false;
let MAPENTITIES;
let mousePos = {
    x: 0,
    y: 0,
};
let GRAVITY;
let entities = [];
let PLR;
/**
 * Entity class
 * */
class entity {
    constructor(x, y, baseSprite, lastSprite, flipSpeed, west = false, north = false, danger = 0, Z = 1) {
        _lastSprFlip.set(this, void 0);
        this.x = x;
        this.y = y;
        this.baseSprite = baseSprite;
        this.lastSprite = lastSprite;
        this.flipSpeed = flipSpeed;
        this.west = west;
        this.north = north;
        this.sprite = baseSprite;
        this.danger = danger;
        this.Z = Z;
        __classPrivateFieldSet(this, _lastSprFlip, Date.now());
    }
    checkFlipSprite() {
        let now = Date.now();
        if (now - __classPrivateFieldGet(this, _lastSprFlip) < this.flipSpeed)
            return;
        __classPrivateFieldSet(this, _lastSprFlip, now);
        this.sprite += 1;
        if (this.sprite > this.lastSprite)
            this.sprite = this.baseSprite;
    }
    update() {
        this.checkFlipSprite();
    }
    draw() {
        draw_image(g.CVS, SPRIMAGES[this.sprite], SCALEW, SCALEH, this.x, this.y, 0, this.west, this.north);
    }
    ;
    checkEntitiesCollision() {
        let thisEastBorder = this.x + SPRIMAGES[this.baseSprite].width;
        let thisWestBorder = this.x;
        let thisNorthBorder = this.y;
        let thisSouthBorder = this.y + SPRIMAGES[this.baseSprite].height;
        for (let index = 0; index < entities.length; index++) {
            if (entities[index] == this)
                continue;
            if (this.Z > entities[index].Z)
                continue;
            let otherEastBorder = entities[index].x + SPRIMAGES[entities[index].baseSprite].width;
            let otherWestBorder = entities[index].x;
            let otherNorthBorder = entities[index].y;
            let otherSouthBorder = entities[index].y + SPRIMAGES[entities[index].baseSprite].height;
            if (thisSouthBorder < otherNorthBorder) {
                continue;
            }
            if (thisNorthBorder > otherSouthBorder) {
                continue;
            }
            if (thisEastBorder < otherWestBorder) {
                continue;
            }
            if (thisWestBorder > otherEastBorder) {
                continue;
            }
            return index;
        }
        return -1;
    }
}
_lastSprFlip = new WeakMap();
class movable extends entity {
    constructor(x, y, baseSprite, lastSprite, flipSpeed, west, north, danger, Z, weight, speed, stillSprite, moveFn) {
        super(x, y, baseSprite, lastSprite, flipSpeed, west, north, danger, Z);
        _lastSprFlip_1.set(this, void 0);
        this.baseSprite = baseSprite;
        this.lastSprite = lastSprite;
        this.flipSpeed = flipSpeed;
        this.west = west;
        this.north = north;
        this.weight = weight;
        this.speed = speed;
        this.stillSprite = stillSprite;
        this.sprite = baseSprite;
        this.moveFn = moveFn;
        this.moving = false;
        this.falling = false;
        __classPrivateFieldSet(this, _lastSprFlip_1, Date.now());
    }
    assesGravity() {
        /* Gravity  */
        let movement = this.weight * GRAVITY;
        this.moveNorthSouth(movement);
        return;
    }
    moveNorthSouth(amount = this.speed) {
        let prevY;
        let delta = 1;
        this.north = false;
        if (amount < 0) {
            delta = -1;
            this.north = true;
        }
        this.falling = true;
        for (let dy = 0; dy < Math.abs(amount); dy++) {
            prevY = this.y;
            this.y += delta;
            if (this.north) {
                if (this.NorthCollis() || this.checkEntitiesCollision() >= 0) {
                    this.y = prevY;
                    this.falling = false;
                    return false;
                }
            }
            else {
                if (this.SouthCollis() || this.checkEntitiesCollision() >= 0) {
                    this.y = prevY;
                    this.falling = false;
                    return false;
                }
            }
        }
        return true;
    }
    moveEastWest(amount = this.speed) {
        let prevX;
        let delta = 1;
        this.west = false;
        if (amount < 0) {
            delta = -1;
            this.west = true;
        }
        this.moving = true;
        for (let dx = 0; dx < Math.abs(amount); dx++) {
            prevX = this.x;
            this.x += delta;
            if (this.west) {
                if (this.WestCollis() || this.checkEntitiesCollision() >= 0) {
                    this.x = prevX;
                    this.moving = false;
                    return false;
                }
            }
            else {
                if (this.EastCollis() || this.checkEntitiesCollision() >= 0) {
                    this.x = prevX;
                    this.moving = false;
                    return false;
                }
            }
        }
        return true;
    }
    unStickFrom(e) {
        let prevX = this.x;
        if (this.x < entities[e].x) {
            while (this.x + SPRIMAGES[this.baseSprite].width >= entities[e].x) {
                this.x -= 1;
            }
            if (this.WestCollis()) {
                this.x = prevX;
            }
            else {
                return;
            }
        }
        /*  Assuming moving left did not work  */
        while (this.x <= entities[e].x + SPRIMAGES[entities[e].baseSprite].width) {
            this.x += 1;
        }
        if (this.EastCollis()) {
            this.x = prevX;
        }
        else {
            return;
        }
    }
    /* Overload the base class entity  update  */
    update() {
        this.moveFn();
        this.assesGravity();
        this.checkFlipSprite();
    }
    EastCollis() {
        let x = (this.x + SPRIMAGES[this.baseSprite].width);
        for (let y = this.y; y <= (this.y + SPRIMAGES[this.baseSprite].height); y += 8) {
            if (x >= MAPIMAGES[CURMAP].width) {
                return true;
            }
            if (fmap(x / 8, y / 8, CURMAP, 1)) {
                return true;
            }
        }
        return false;
    }
    WestCollis() {
        let x = (this.x);
        for (let y = this.y; y <= (this.y + SPRIMAGES[this.baseSprite].height); y += 8) {
            if (x <= 0) {
                return true;
            }
            if (fmap(x / 8, y / 8, CURMAP, 1)) {
                return true;
            }
        }
        return false;
    }
    SouthCollis() {
        let y = (this.y + SPRIMAGES[this.baseSprite].height);
        for (let x = this.x; x <= (this.x + SPRIMAGES[this.baseSprite].width); x += 8) {
            if (y >= MAPIMAGES[CURMAP].height) {
                return true;
            }
            if (fmap(x / 8, y / 8, CURMAP, 1)) {
                return true;
            }
        }
        return false;
    }
    ;
    NorthCollis() {
        let y = (this.y);
        for (let x = this.x; x <= (this.x + SPRIMAGES[this.baseSprite].width); x += 8) {
            if (y <= 0) {
                return true;
            }
            if (fmap(x / 8, y / 8, CURMAP, 1)) {
                return true;
            }
        }
        return false;
    }
    checkFlipSprite() {
        if (!this.moving) {
            this.sprite = this.stillSprite;
            return;
        }
        super.checkFlipSprite();
    }
}
_lastSprFlip_1 = new WeakMap();
/***
 * player class
 * */
class player extends movable {
    constructor(x, y, baseSprite, lastSprite, flipSpeed, west, north, danger, Z, /*  Entity object arguments  */ weight, speed, stillSprite, moveFn, /*  Movable object arguments  */ keyNorth, keySouth, keyEast, keyWest, keyAction1, keyAction2, carrySprite, shootSprite, jumpFrames /*  player object argument  */) {
        super(x, y, baseSprite, lastSprite, flipSpeed, west, north, danger, Z, weight, speed, stillSprite, moveFn);
        _lastSprFlip_2.set(this, void 0);
        _carrying.set(this, void 0);
        _jumping.set(this, void 0);
        _jumpStartTime.set(this, void 0);
        this.sprite = baseSprite;
        this.moving = false;
        this.keyNorth = keyNorth;
        this.keySouth = keySouth;
        this.keyEast = keyEast;
        this.keyWest = keyWest;
        this.keyAction1 = keyAction1;
        this.keyAction2 = keyAction2;
        this.carrySprite = carrySprite;
        this.shootSprite = shootSprite;
        this.jumpFrames = jumpFrames;
        __classPrivateFieldSet(this, _jumping, 0);
        __classPrivateFieldSet(this, _jumpStartTime, 0);
        __classPrivateFieldSet(this, _carrying, -1);
        __classPrivateFieldSet(this, _lastSprFlip_2, Date.now());
        this.bullets = [];
    }
    /* Overload the base class movable  update  */
    update() {
        let e = this.checkEntitiesCollision();
        if ((e >= 0 && entities[e].danger > 3) ||
            fmap(this.x / 8, this.y / 8, CURMAP, 3) ||
            fmap((this.x + SPRIMAGES[this.baseSprite].width) / 8, this.y / 8, CURMAP, 3) ||
            fmap(this.x / 8, (this.y + SPRIMAGES[this.baseSprite].height) / 8, CURMAP, 3) ||
            fmap((this.x + SPRIMAGES[this.baseSprite].width) / 8, (this.y + SPRIMAGES[this.baseSprite].height) / 8, CURMAP, 3)) {
            entities = [];
            g.start();
            return;
        }
        if (fmap(this.x / 8, this.y / 8, CURMAP, 2) && this.weight > 0) {
            this.weight = -1 * this.weight;
            this.north = true;
        }
        else if (!fmap(this.x / 8, this.y / 8, CURMAP, 2) && this.weight < 0) {
            this.weight = -1 * this.weight;
            this.north = false;
        }
        if (this.x + SPRIMAGES[this.baseSprite].width >= 511) {
            CURMAP += 1;
            this.x = 1;
            this.bullets = [];
            entities = MAPENTITIES[CURMAP];
        }
        if (__classPrivateFieldGet(this, _jumping) > 0) {
            let max = 1.80; // representative of the amplitude of this
            if (GRAVITY < 0)
                max *= -1;
            let jumpOffset = max * (__classPrivateFieldGet(this, _jumping));
            console.log("JumpOffset: " + jumpOffset);
            if (!this.moveNorthSouth(-jumpOffset))
                __classPrivateFieldSet(this, _jumping, 0);
            __classPrivateFieldSet(this, _jumping, __classPrivateFieldGet(this, _jumping) - 1);
        }
        else {
            // this.#jumping = false;
        }
        this.checkInput();
        super.update();
    }
    jump() {
        if (__classPrivateFieldGet(this, _jumping)) {
            return;
        }
        __classPrivateFieldSet(this, _jumping, this.jumpFrames);
    }
    shoot() {
        let moveFn = function () {
            if (!this.moveEastWest(this.speed) && this.weight == 0) {
                this.speed = 0;
                this.weight = PLR.weight;
                this.startKillTime = Date.now();
                this.Z = 3;
                let e = this.checkEntitiesCollision();
                if (e >= 0)
                    this.unStickFrom(e);
            }
            if (this.weight != 0) {
                this.moving = false;
            }
        };
        let xPos = this.x;
        let yPos = this.y;
        let speed = 30;
        if (GRAVITY < 0) {
            yPos += 12;
        }
        else {
            yPos += 4;
        }
        if (this.west) {
            xPos -= (1 + 8);
            speed *= -1;
        }
        else {
            xPos += SPRIMAGES[this.baseSprite].width + 1;
        }
        let b = new movable(xPos, yPos, 113, 115, 500, false, false, 1, 2, 0, speed, 116, moveFn);
        let e = b.checkEntitiesCollision();
        if (e >= 0) {
            return;
        }
        this.bullets.push(b);
        if (this.bullets.length > 2) {
            let index = entities.indexOf(this.bullets[0]);
            if (index >= 0)
                entities.splice(index, 1);
            this.bullets.splice(0, 1);
        }
        entities.push(b);
    }
    keyClicked(key) {
        if (key[this.keyNorth]) {
            let tmpY = this.y;
            if (GRAVITY < 0)
                this.y -= 1;
            else
                this.y += 1;
            if (this.SouthCollis() || this.checkEntitiesCollision() >= 0 || (GRAVITY < 0 && this.NorthCollis())) {
                this.jump();
            }
            this.y = tmpY;
        }
        if (key[this.keyAction2]) {
            GRAVITY *= -1;
        }
        /* Shooting disabled  */
        if (key[this.keyAction1]) {
            this.shoot();
        }
    }
    checkInput() {
        this.moving = false;
        if (g.keysDown[this.keyEast]) {
            this.moveEastWest(this.speed);
        }
        if (g.keysDown[this.keyWest]) {
            this.moveEastWest(-this.speed);
        }
        let prevX = this.x;
        if (this.west) {
            this.x -= 8; //todo #p3 fix this being hardcoded
        }
        else {
            this.x += 8; //todo #p3 fix this being hardcoded
        }
        let e = this.checkEntitiesCollision();
        this.x = prevX;
    }
    /**
     * Overloads the super checkFlipSprite
     * */
    checkFlipSprite() {
        if (!this.moving) {
            /*  Only do actions if not moving  */
            if (g.keysDown[this.keyAction1]) {
                this.sprite = this.carrySprite;
                return;
            }
            if (g.keysDown[this.keyAction2]) {
                this.sprite = this.shootSprite;
                return;
            }
        }
        super.checkFlipSprite();
    }
}
_lastSprFlip_2 = new WeakMap(), _carrying = new WeakMap(), _jumping = new WeakMap(), _jumpStartTime = new WeakMap();
function addMovable(x = undefined, y = undefined, baseSprite = 101, lastSprite = 101, flipSpeed = Infinity, weight = 0, speed = 0, danger = 0) {
    if (x == undefined) {
        x = Math.random() * 512;
    }
    if (y == undefined) {
        y = Math.random() * 512 / 2;
    }
    let moveFn = function () {
        if (!this.moveEastWest(this.speed)) {
            this.speed *= -1;
            return;
        }
        this.moving = true;
    };
    let e = new movable(x, y, baseSprite, lastSprite, flipSpeed, false, false, danger, 3, weight, speed, baseSprite, moveFn);
    entities.push(e);
    return entities.length - 1;
}
g.pre_parse = function () {
    MAPENTITIES = [];
    for (let map = 0; map < MAPS.length; map++) {
        entities = [];
        let x = 0;
        let y = 0;
        for (y = 0; y < MAPS[map].length; y++) {
            for (x = 0; x < MAPS[map][0].length; x++) {
                if (MAPS[map][y][x] == 10) {
                    addMovable(x * 8, y * 8, 10, 10, Infinity, 3, 0, 4);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 102) {
                    addMovable(x * 8, y * 8, 102, 110, 100, 3, 5, 4);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 5) {
                    addMovable(x * 8, y * 8, 5, 6, 100, 3, 5, 4);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 0) {
                    addMovable(x * 8, y * 8, 0, 4, 50, 0, 2, 0);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 11) {
                    addMovable(x * 8, y * 8, 11, 13, 100, 3, 5, 4);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 14) {
                    let e = addMovable(x * 8, y * 8, 14, 16, 100, 3, 5, 4);
                    entities[e].moveFn = function () {
                        if (!this.moveEastWest(this.speed)) {
                            this.speed *= -1;
                            return;
                        }
                        this.moving = true;
                        if (GRAVITY < 0) {
                            this.weight = -1 * Math.abs(this.weight);
                        }
                        else if (GRAVITY > 0) {
                            this.weight = Math.abs(this.weight);
                        }
                    };
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 17) {
                    let e = addMovable(x * 8, y * 8, 17, 19, 100, 3, 5, 4);
                    entities[e].moveFn = function () {
                        if (!this.moveEastWest(this.speed)) {
                            this.speed *= -1;
                            return;
                        }
                        this.moving = true;
                        if (GRAVITY < 0) {
                            this.weight = Math.abs(this.weight);
                        }
                        else if (GRAVITY > 0) {
                            this.weight = -1 * Math.abs(this.weight);
                        }
                    };
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 20) {
                    let e = addMovable(x * 8, y * 8, 20, 22, 100, -3, 5, 4);
                    MAPS[map][y][x] = 254;
                }
                if (MAPS[map][y][x] == 9) {
                    addMovable(x * 8, y * 8, 9, 9, Infinity, 3, 0, 4);
                    MAPS[map][y][x] = 254;
                }
            }
        }
        MAPENTITIES.push(entities);
    }
};
g.init = function () {
    console.log("initializeing g");
    GRAVITY = 4;
    CURMAP = 0;
    entities = MAPENTITIES[CURMAP];
    SCALEW = Math.floor(g.CVS.width / MAPIMAGES[0].width);
    SCALEH = Math.floor(g.CVS.height / MAPIMAGES[0].height);
    {
        let x = 10;
        let y = 100;
        let baseSprite = 102;
        let lastSprite = 109;
        let flipSpeed = 45;
        let west = false;
        let north = false;
        let danger = 0;
        let weight = 3;
        let speed = 5;
        let stillSprite = 101;
        let keyNorth = 38;
        let keySouth = 40;
        let keyEast = 39;
        let keyWest = 37;
        let keyAction1 = 88;
        let keyAction2 = 90;
        let carrySprite = 111;
        let shootSprite = 112;
        let jumpFrames = 8;
        let moveFn = function () { };
        PLR = {};
        PLR = new player(x, y, baseSprite, lastSprite, flipSpeed, west, north, danger, 1, weight, speed, stillSprite, moveFn, keyNorth, keySouth, keyEast, keyWest, keyAction1, keyAction2, carrySprite, shootSprite, jumpFrames);
        for (let i = 0; i < MAPENTITIES.length; i++) {
            MAPENTITIES[i].push(PLR);
        }
        // entities.push(PLR);
    }
};
g.draw = function () {
    G_TMPCTX.clearRect(0, 0, G_TMPCVS.width, G_TMPCVS.height);
    g.CTX.clearRect(0, 0, g.CVS.width, g.CVS.height);
    draw_image(g.CVS, MAPIMAGES[CURMAP]);
    for (let index = 0; index < entities.length; index++) {
        entities[index].draw();
    }
    let fps = get_fps();
    let info = PLR.x + ", " + PLR.y + "; " + PLR.weight + "  FPS: " + fps;
    info += "pixel Pos = (" + mousePos.x + ", " + mousePos.y + "); ";
    draw_text_info(g.CVS, 510, info);
    // draw_text_info(g.CVS, 510, info);
};
g.update = function () {
    if (PAUSED)
        return;
    for (let index = 0; index < entities.length; index++) {
        let x = entities[index].x;
        let y = entities[index].y;
        entities[index].update();
    }
};
g.keyClicked = function (keys) {
    for (let index = 0; index < entities.length; index++) {
        let x = entities[index].x;
        let y = entities[index].y;
        // Call keyclicked for whichever entity has a keclicked function
        (entities[index].keyClicked && entities[index].keyClicked(keys));
    }
    // /*  Lets slow down time  */
    // if (keys[PLR.keySouth]) {
    //     if( g.fps == 200 ){
    //         g.fps = 30;
    //     } else {
    //         g.fps = 200;
    //     }
    // }
};
g.start();
// document.getElementById("play_g").dispatchEvent(new MouseEvent("click"));
g.CVS.addEventListener('mousedown', function (evt) {
    let absPos = getMousePos(g.CVS, evt);
    let map = MAPS[CURMAP];
    if (map != undefined) {
        mousePos = get_pixel_pos_img(absPos, map, g.CVS.width, g.CVS.height);
        addMovable(mousePos.x * 8, mousePos.y * 8, 11, 13, 100, 1, 1, 4);
    }
}, false);
g.CVS.addEventListener('mousemove', function (evt) {
    let absPos = getMousePos(g.CVS, evt);
    let map = MAPS[CURMAP];
    if (map != undefined) {
        mousePos = get_pixel_pos_img(absPos, map, g.CVS.width, g.CVS.height);
    }
}, false);
//# sourceMappingURL=game.js.map
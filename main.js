function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Pipe(game) {
    this.x = 80;
    this.y = 243;
    this.name = "pipe";
    Entity.call(this, game, this.x, this.y);
}

Pipe.prototype = new Entity();
Pipe.prototype.constructor = Pipe2;

Pipe.prototype.update = function () {
}

Pipe.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/pipe.png"), this.x, this.y);
    Entity.prototype.draw.call(this);
    //ctx.rect(80,243,56,57);
    //ctx.stroke();
}

function Pipe2(game) {
    this.x = 450;
    this.y = 230;
    this.name = "pipe";
    Entity.call(this, game, this.x, this.y);
}

Pipe2.prototype = new Entity();
Pipe2.prototype.constructor = Pipe2;

Pipe2.prototype.update = function () {
}

Pipe2.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/pipe2.png"), this.x, this.y);
    Entity.prototype.draw.call(this);
    //ctx.rect(450,230,56,70);
    //ctx.stroke();
}

function Lakitu(game, speed, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/lakituReverse.png"), 0, 0, 28.7, 75, 0.05, 14, true, true);
    Entity.call(this, game, x, y);
    this.speed = speed;
    this.name = "lakitu";
    this.released = false;
    this.goomba = null;
    this.pause = false;
    //this.position = Math.floor(Math.random() * (400 - 150) + 150);
}

Lakitu.prototype.setPause = function (pause) {
    this.pause = pause;
}

Lakitu.prototype.setX = function (x) {
    Entity.prototype.setX.call(this, x);
}

Lakitu.prototype.setY = function (y) {
    Entity.prototype.setY.call(this, y);
}

Lakitu.prototype.setSpeed = function (speed) {
    this.speed = speed;
}

Lakitu.prototype = new Entity();
Lakitu.prototype.constructor = Lakitu;

Lakitu.prototype.update = function () {

    //console.log()

    if (this.pause) {} else {

    Entity.prototype.update.call(this);

    this.x -= 2;

    if (this.x === 250) {
        this.goomba = new Goomba(this.game, 0.2, 250, this.y);
        this.released = true;
        this.goomba.drop = true;
        this.game.addEntity(this.goomba);
    }
}
}

Lakitu.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
    // ctx.rect(this.x,this.y,20,30);
    // ctx.stroke();
}

function Goomba(game, speed, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goomba.png"), 0, 0, 23.5, 35, 0.05, 11, true, false);
    Entity.call(this, game, x, y);
    this.speed = speed;
    this.reverse = false;
    this.name = "goomba";
    this.game = game;
    this.collisions = 0;
    this.drop = false;
}

Goomba.prototype = new Entity();
Goomba.prototype.constructor = Goomba;

Goomba.prototype.setX = function (x) {
    Entity.prototype.setX.call(this, x);
}

Goomba.prototype.setY = function (y) {
    Entity.prototype.setY.call(this, y);
};

Goomba.prototype.getY = function () {
    Entity.prototype.getY.call(this);
}

Goomba.prototype.setReverse = function(reverse) {
    this.reverse = reverse;
}

Goomba.prototype.setCollisions = function(collisions) {
    this.collisions = collisions;
}

Goomba.prototype.setDrop = function(drop) {
    this.drop = drop;
}


Goomba.prototype.getCollisions = function() {
    return this.collisions;
}

Goomba.prototype.getReverse = function() {
    return this.reverse;
}

Goomba.prototype.getDrop = function() {
    return this.drop;
}

Goomba.prototype.setSpeed = function (speed) {
    this.speed = speed;
}

Goomba.prototype.update = function () {

    Entity.prototype.update.call(this);

    if (this.game.LakituTimer > 40) {
        this.game.addEntity(new Lakitu(this.game, 2, 550, 100));
        this.game.LakituTimer = 0;
    } else {
        this.game.LakituTimer += this.game.clockTick;
    }

    if (this.drop) {
        this.y += 4;
        if (this.y >= 272) {
            this.y = 272;
            this.drop = false;
        }
    } else {

// Collision detection for the first pipe
if (!(((this.y + 35) < (this.game.pipe.y)) ||
        (this.y > (this.game.pipe.y + 57))||
        ((this.x + 23.5) < this.game.pipe.x) ||
        (this.x > (this.game.pipe.x + 56)))) {

        if (this.reverse === false) {
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goombaReverse.png"), 0, 0, 23.5, 35, 0.05, 11, true, true);
        this.reverse = true;
        this.x -= 1;
    } else {
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goomba.png"), 0, 0, 23.5, 35, 0.05, 11, true, false);
        this.reverse = false;
        this.x += 1;
    }    
        this.collisions++;
// Collision detection for the second pipe
} else if (!(((this.y + 35) < (this.game.pipe2.y)) ||
        (this.y > (this.game.pipe2.y + 70)) ||
        ((this.x + 23.5) < this.game.pipe2.x) ||
        (this.x > (this.game.pipe2.x + 56))
    )) {

        if (this.reverse === false) {
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goombaReverse.png"), 0, 0, 23.5, 35, 0.05, 11, true, true);
        this.reverse = true;
        this.x -= 1;
    } else {
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goomba.png"), 0, 0, 23.5, 35, 0.05, 11, true, false);
        this.reverse = false;
        this.x += 1;
    }  
        this.collisions++;
} 
    if (this.reverse) {
        this.x -= this.speed;
    } else {
        this.x += this.speed;
    }

// Collision detection for goomba's    
for (i = 0; i < this.game.entities.length; i++) {
    var ent = this.game.entities[i];
    if (ent.name === "goomba" && ent !== this) {

       if (!(((this.y + 35) < (ent.y)) ||
        (this.y > (ent.y + 35)) ||
        ((this.x + 23.5) < ent.x) ||
        (this.x > (ent.x + 23.5)))) {
            if (this.reverse === false && ent.reverse === true) {
                this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goombaReverse.png"), 0, 0, 23.5, 35, 0.05, 11, true, true);
                this.reverse = true;
                this.x -= 1;
                ent.animation = new Animation(ASSET_MANAGER.getAsset("./img/goomba.png"), 0, 0, 23.5, 35, 0.05, 11, true, false);
                ent.reverse = false;
                ent.x += 1;
            } else {
                ent.animation = new Animation(ASSET_MANAGER.getAsset("./img/goombaReverse.png"), 0, 0, 23.5, 35, 0.05, 11, true, true);
                ent.reverse = true;
                ent.x -= 1;
                this.animation = new Animation(ASSET_MANAGER.getAsset("./img/goomba.png"), 0, 0, 23.5, 35, 0.05, 11, true, false);
                this.reverse = false;
                this.x += 1;
            }
                this.collisions++;
                ent.collisions++;
       }   

    if (this.reverse) {
        this.x -= this.speed;
    } else {
        this.x += this.speed;
    }

    if (ent.reverse) {
        ent.x -= ent.speed;
    } else {
        ent.x += ent.speed;
    }
    }

    if (this.collisions > 30) {
        if (this.game.activeGoombas.contains(this)) {
            var index = this.game.activeGoombas.indexOf(this);
           // console.log(index);
            this.game.activeGoombas.splice(index--, 1);
        }
        this.removeFromWorld = true;
    }
}
}

}

Goomba.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
    // ctx.rect(this.x,this.y,20,30);
    // ctx.stroke();
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/level.png");
ASSET_MANAGER.queueDownload("./img/goomba.png");
ASSET_MANAGER.queueDownload("./img/pipe.png");
ASSET_MANAGER.queueDownload("./img/pipe2.png");
ASSET_MANAGER.queueDownload("./img/goombaReverse.png");
ASSET_MANAGER.queueDownload("./img/lakituReverse.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var save = document.getElementById('save');
    var load = document.getElementById('load');
    var pause = document.getElementById('pause');
    var socket = io.connect("http://76.28.150.193:8888");

    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();

    // pause.onclick = function() {pauseFunction()};

    // function pauseFunction() {
    //     gameEngine.activeLakitu.setPause(true);
    // }

    save.onclick = function() {saveFunction()};

    function saveFunction() {
        socket.emit("save", { studentname: "Vladimir Smirnov", statename: "aState", data: gameEngine.getValues() });
        console.log(gameEngine.activeGoombas.length);
        //console.log(gameEngine.getValues());
    }

    load.onclick = function() {loadFunction()};

    socket.on("load", function (data) {

      // for (var i = 0; i < gameEngine.entities.length; i++) {
      //   if (gameEngine.entities[i].name !== "pipe") gameEngine.entities.splice(i, 1);
      // }

        gameEngine.entities = [];
        gameEngine.activeGoombas = [];

        var pipe = new Pipe(gameEngine);
        var pipe2 = new Pipe2(gameEngine);

        gameEngine.setPipe(pipe);
        gameEngine.setPipe2(pipe2);

        gameEngine.addEntity(pipe);
        gameEngine.addEntity(pipe2);

       var goombaArray = data.data.GoombaArray;
       for (var i = 0; i < goombaArray.length; i++) {
       var goomba = new Goomba(gameEngine, 0.2, goombaArray[i].x, 272);
       goomba.setCollisions(goombaArray[i].collisions);
       goomba.setReverse(goombaArray[i].reverse);
       goomba.setDrop(goombaArray[i].drop)
       gameEngine.addEntity(goomba);
       }
       gameEngine.addEntity(new Lakitu(gameEngine, 2, data.data.activeLakituX, 100));

       //console.log(gameEngine.activeGoombas.length);

    });

    function loadFunction() {
        socket.emit("load", { studentname: "Vladimir Smirnov", statename: "aState"});
    }


    var goomba =  new Goomba(gameEngine, 0.2, 150, 272);
    var goomba2 = new Goomba(gameEngine, 0.2, 200, 272);
    var goomba3 = new Goomba(gameEngine, 0.2, 250, 272);
    var goomba4 = new Goomba(gameEngine, 0.2, 300, 272);
    var goomba5 = new Goomba(gameEngine, 0.2, 350, 272);
    var goomba6 = new Goomba(gameEngine, 0.2, 400, 272);
    var goomba7 = new Goomba(gameEngine, 0.2, 300, 272);

    var pipe = new Pipe(gameEngine);
    var pipe2 = new Pipe2(gameEngine);

    gameEngine.setPipe(pipe);
    gameEngine.setPipe2(pipe2);

    gameEngine.addEntity(goomba);
    gameEngine.addEntity(goomba2);
    gameEngine.addEntity(goomba3);
    gameEngine.addEntity(goomba4);
    gameEngine.addEntity(goomba5);
    gameEngine.addEntity(goomba6);

    gameEngine.addEntity(pipe);
    gameEngine.addEntity(pipe2);
 
    gameEngine.init(ctx);
    gameEngine.start();
});

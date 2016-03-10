// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.activeGoombas = [];
    this.activeLakitu = null;
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.pipe = null;
    this.pipe2 = null;
    this.LakituTimer = 40;
    this.GoombaTimer = 10;

}

GameEngine.prototype.getData = function () {
    
}

GameEngine.prototype.setPipe = function (pipe) {
    this.pipe = pipe;
}

GameEngine.prototype.setPipe2 = function (pipe) {
    this.pipe2 = pipe;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
//        console.log(e);
        e.preventDefault();
    }, false);

    console.log('Input started');
}

Array.prototype.contains = function ( item ) {
   for (i in this) {
       if (this[i] == item) return true;
   }
   return false;
}

GameEngine.prototype.addEntity = function (entity) {
   // console.log('added entity');
    if(entity.name === "goomba") this.activeGoombas.push(entity);
    if(entity.name === "lakitu") this.activeLakitu = entity;
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    this.ctx.drawImage(ASSET_MANAGER.getAsset("./img/level.png"), 0, 0);
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }

    if (this.GoombaTimer > 10) {
        var position = Math.random() * (400 - 150) + 150;
        this.addEntity(new Goomba(this, 0.2, position, 272));
        this.GoombaTimer = 0;
    } else {
        this.GoombaTimer += this.clockTick;
    }

   // console.log(this.activeGoombas.length);
  // console.log(this.activeLakitu.getX() + " " + this.activeLakitu.getY());
  //console.log(this.activeGoombas[0].getCollisions());


}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
}

GameEngine.prototype.getValues = function() {
   // this.game = game;
   var GoombaArray = [];
   that = this;
   for (var i = 0; i < this.activeGoombas.length; i++) {
        var Goomba = {
            x: that.activeGoombas[i].getX(),
            reverse: that.activeGoombas[i].getReverse(),
            collisions: that.activeGoombas[i].getCollisions(),
            drop: that.activeGoombas[i].getDrop()
        };
        GoombaArray.push(Goomba);
   }
   var Package = {
        GoombaArray: GoombaArray,
        activeLakituX: this.activeLakitu.getX()
   };
    return Package;
};




function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.setX = function (x) {
    this.x = x;
}

Entity.prototype.setY = function (y) {
    this.y = y;
}

Entity.prototype.getY = function () {
    return this.y;
}

Entity.prototype.getX = function () {
    return this.x;
}


Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

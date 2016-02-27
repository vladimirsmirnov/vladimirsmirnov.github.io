function Background(game, image) {
    NonLivingEntity.call(this, game, 0, 400);
    this.radius = 200;
    NonLivingEntity.prototype.setImage(image);
   this.image = image;
}

Background.prototype = new NonLivingEntity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    
}

Background.prototype.draw = function (ctx) {
     NonLivingEntity.prototype.draw.call(this, ctx);
}

// function Man(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 79, 87, 0.05, 6, true, false); 
//     //this.spriteSheet = this.rotateAndCache((ASSET_MANAGER.getAsset("./img/man.png")), 90);
//    // this.animation = new Animation(spritesheet, 80, 80, 0.05, 1, true, false);
//     this.x = 0;
//     this.y = 0;
//     this.game = game;
//     this.ctx = game.ctx;
// }

// Man.prototype = new Entity();
// Man.prototype.constructor = Man;

// Man.prototype.update = function() {
//     this.x += 2;
// }


// Man.prototype.draw = function () {
//     console.log("drawing");
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }

// the "main" code begins here

// var ASSET_MANAGER = new AssetManager();

// ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
// ASSET_MANAGER.queueDownload("./img/man2.png");


/** From 435 */

ASSET_MANAGER.queueDownload("./images/demon.png");
ASSET_MANAGER.queueDownload("./images/ZombieWalking.png");
ASSET_MANAGER.queueDownload("./images/Player2.png");

ASSET_MANAGER.queueDownload("./images/ForestLevelBig.png");
ASSET_MANAGER.queueDownload("./images/hospital.png");
ASSET_MANAGER.queueDownload("./images/boss.png");
ASSET_MANAGER.queueDownload("./images/flamethrower.png");
ASSET_MANAGER.queueDownload("./images/HealthPack.png");
ASSET_MANAGER.queueDownload("./images/speed.png");
ASSET_MANAGER.queueDownload("./images/flame3.png");
ASSET_MANAGER.queueDownload("./images/cone.png");
ASSET_MANAGER.queueDownload("./images/shooter-walking.png");
ASSET_MANAGER.queueDownload("./images/shooter-walking2.png");

// Moving Animations
ASSET_MANAGER.queueDownload("./images/boss-moving.png");
ASSET_MANAGER.queueDownload("./images/zombie-moving.png");

ASSET_MANAGER.queueDownload("./images/boss2.png");

ASSET_MANAGER.queueDownload("./images/portal.png");
ASSET_MANAGER.queueDownload("./images/bossMap1.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
	gameEngine.init(ctx);

	//to add entities, change maps and otherwise setup the game go to gameEngine SetupGameState
	gameEngine.start();

});

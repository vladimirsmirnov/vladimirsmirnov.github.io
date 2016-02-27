function FlameThrower(game, image) {
    // NonLivingEntity.prototype.setImage.call(this, image);
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;
    // this.x = Math.random() * 600;
    // this.y = Math.random() * 600;

    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 100, y: 100 };
    this.spawnPoints[1] = { x: 440, y: 360 };
    this.spawnPoints[2] = { x: 570, y: 1150 };
    this.spawnPoints[3] = { x: 1020, y: 650 };
    this.spawnPoints[4] = { x: 980, y: 370 };

    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    this.x = spawnpoint.x;
    this.y = spawnpoint.y;

    // this.spawnPoints = [];
    // this.spawnPoints[0] = { x: 190, y: 213 };
    // this.spawnPoints[1] = { x: 659, y: 136 };
    // this.spawnPoints[2] = { x: 976, y: 303 };
    // this.spawnPoints[3] = { x: 965, y: 706 };
    // this.spawnPoints[4] = { x: 167, y: 154 };
    // this.spawnPoints[5] = { x: 138, y: 222 };
    // this.spawnPoints[6] = { x: 184, y:  283 };

    // var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    this.width = 45;
    this.height = 20;

    this.canvasX = spawnpoint.x;
    this.canvasY = spawnpoint.y;

    this.shooting = false;
    this.radius = 30;
    this.name = "FlameThrower";
    this.type = "weapon";
    this.newTemp = 0;
    this.newTemp2 = 0;
}

FlameThrower.prototype = new NonLivingEntity();
FlameThrower.prototype.constructor = FlameThrower;

FlameThrower.prototype.update = function () {
    // if (this.game.click) {
    //     console.log("shooting");
    //     this.shooting = true;
    //     this.game.addEntity(new Flame(this.game, ASSET_MANAGER.getAsset("./images/flame2.png")));
    // } 
    //     this.shooting = false;
}

FlameThrower.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);
}

function Flame(game, originator, dir) {
	// var dist = distance(originator, dir);
	// var tempdirx = dir.x/dist;
	// var tempdiry = dir.y/dist;
    this.origin = {x:originator.x + dir.x * (this.radius + originator.radius), y:originator.y + dir.y * (this.radius + originator.radius)};
	Entity.call(this, game, this.origin.x, this.origin.y);
    this.spriteSheet = ASSET_MANAGER.getAsset("./images/flame3.png");
	//console.log(this.spriteSheet);
	//Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) 
    this.animation = new Animation(this.spriteSheet, 40, 40, 0.05, 8, true, false, 8);  
	this.setMovingAnimation(this.spriteSheet, 40, 40, 0.05, 8, true, false, 8);  
    this.game = game;
    this.name = "Flame";
    this.type = "projectile";
    this.ctx = game.ctx;
    this.radius = 30;
    this.maxSpeed = 200;
	this.range = 100;
    this.strength = 100;
    this.velocity = { x: 50, y: 50 };
}

Flame.prototype = new LivingEntity();
Flame.prototype.constructor = Flame;

Flame.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Flame.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Flame.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Flame.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Flame.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Flame.prototype.update = function () {
    LivingEntity.prototype.update.call(this);
	
	this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick ;
	if (distance(this, this.origin) > this.range ) {
		this.removeFromWorld = true;
	}
	var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
}

Flame.prototype.draw = function (ctx) {
    //this.animation.drawFrameRotate(this.game.clockTick, this.ctx, this.x , this.y, 0, 0, 5);
	NonLivingEntity.prototype.draw.call(this, ctx);
 }

function Villain(game, clone) {
    // LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);
    // LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);


    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 1360, y: 652 };
    this.spawnPoints[1] = { x: 1231, y: 322 };
    this.spawnPoints[2] = { x: 1338, y: 80 };
    this.spawnPoints[3] = { x: 1073, y: 460 };
    this.spawnPoints[4] = { x: 874, y: 411 };
    this.spawnPoints[5] = { x: 939, y: 965 };
    this.spawnPoints[6] = { x: 1027, y:  1225 };
    this.spawnPoints[13] = { x: 1248, y: 1221 };
    this.spawnPoints[7] = { x: 910, y: 683 };
    this.spawnPoints[8] = { x: 660, y: 1029 };
    this.spawnPoints[9] = { x: 360, y: 1233 };
    this.spawnPoints[10] = { x: 360, y: 924};
    this.spawnPoints[11] = { x: 752, y: 1250 };
    this.spawnPoints[12] = { x: 400, y: 632 };
    

    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    LivingEntity.call(this, game, spawnpoint.x, spawnpoint.y);

	this.x = 850;
	this.y = this.game.surfaceHeight * Math.random();
	
	this.radius = 64;
	this.SpriteHeight = 60;
	this.SpriteWidth = 60;
    this.player = 1;
    this.radius = 32;
    this.visualRadius = 10000;

    this.attackRange = 40; // always make sure attack range is larger than comfort zone
    this.comfortZone = 25;
    this.exp = 10;

    this.angleOffset = 260;
    this.name = "Villain";
    this.type = "villain";
    this.color = "Red";

    this.team = "Black";

    this.maxSpeed = minSpeed + (maxSpeed - minSpeed) * Math.random();
    this.healthMAX = 100;
	this.health = this.healthMAX;
    this.strength = 40;
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/zombie-moving.png"), this.SpriteHeight, this.SpriteWidth, .05, 25, true, false, 5);

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.radius = 20;
    this.radialOffset = 15;

};

Villain.prototype = new LivingEntity();
Villain.prototype.constructor = Villain;

Villain.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Villain.prototype.collideLeft = function () {
    return false;//(this.x - this.radius) < 0;
};

Villain.prototype.collideRight = function () {
    return false;//(this.x + this.radius) > 800;
};

Villain.prototype.collideTop = function () {
    return false;//(this.y - this.radius) < 0;
};

Villain.prototype.collideBottom = function () {
    return false;//(this.y + this.radius) > 800;
};

Villain.prototype.update = function () {
    this.aiUpdate("zombie");
    if (this.action.target === null) {
        this.flockTogether();
    }
};

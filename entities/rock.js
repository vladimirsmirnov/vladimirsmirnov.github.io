function Rock(game) {
    this.player = 1;
    this.radius = 4;
	Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
   	this.name = "Rock";
    this.color = "Gray";
    this.maxSpeed = 200;
    this.thrown = false;
    this.strength = 34;
    this.velocity = { x: 0, y: 0 };

};

Rock.prototype = new LivingEntity();
Rock.prototype.constructor = Rock;

Rock.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Rock.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Rock.prototype.collideRight = function () {
    return (this.x + this.radius) > this.game.map.worldWidth;
};

Rock.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Rock.prototype.collideBottom = function () {
    return (this.y + this.radius) > this.game.map.worldHeight;
};

Rock.prototype.update = function () {
    Entity.prototype.update.call(this);
    //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick ;

    if (this.collideLeft() || this.collideRight()) {
		this.removeFromWorld = true;
    }

    if (this.collideTop() || this.collideBottom()) {
		this.removeFromWorld = true;
    }

    var chasing = false;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name === "Rock" && this.thrown && ent.thrown && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x) / dist;
            var difY = (this.y - ent.y) / dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
        }
    }

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Rock.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};
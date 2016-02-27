function Boss(game, x, y) {
    LivingEntity.call(this, game, 150, 150);
    this.radius = 32;
    this.SpriteWidth = 128;
    this.SpriteHeight = 128;
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/boss-moving.png"), this.SpriteWidth, this.SpriteHeight, .05, 24, true, false, 6);
    if (x === undefined) {
        this.x = this.game.surfaceWidth / 2;
    } else {
        this.x = x;
    }

    if (y === undefined) {
        this.y = this.game.surfaceHeight / 2;
    } else {
        this.y = y;
    }

    this.canvasX = this.x;
    this.canvasY = this.y;
    this.radialOffset = this.radius;
    this.team = "Black";
	this.name = "FinalBoss";
    this.type = "villain";
    this.game = game;
    this.ctx = game.ctx;
    this.visualRadius = 1000;
    this.maxSpeed = 80;
	this.healthMAX = 2000;
    this.health = this.healthMAX;
    this.attackRange = 50; // always make sure attack range is larger than comfort zone
    this.comfortZone = 25;
    this.angleOffset = 270;
    this.cooldown = 1;
    this.exp = 30;

    this.ability1Attributes.cooldown = 4;
    this.ability1Attributes.maxCooldown = 4;
}
Boss.prototype = new LivingEntity();
Boss.prototype.constructor = Boss;


Boss.prototype.ability1 = function(entity) {
    console.log("Running Attack!");
    entity.originalMaxSpeed = entity.maxSpeed;
    entity.maxSpeed *= 4;
    entity.movingAnimation.originalFrameDuration = entity.movingAnimation.frameDuration;
    entity.movingAnimation.frameDuration = entity.movingAnimation.frameDuration;
    entity.ability1Timer = 2;
}

Boss.prototype.ability2 = function(entity) {
    console.log("Raise the DEAD!");
    entity.ability2Timer = 4; // this is the timer for the length of time that occurs
    entity.ability2Check = 3;
}

Boss.prototype.ability3 = function(entity) {
    console.log("Heal thyself!");
    entity.ability3Timer = 4;
    entity.healingCircle = 50 + this.radius;
	this.health += 25;
}

Boss.prototype.draw = function(ctx) {
    if (this.healingCircle) {
        this.drawCircle(ctx, "yellow", this.canvasX, this.canvasY, this.healingCircle, 5);
    }
    LivingEntity.prototype.draw.call(this, ctx);
}

Boss.prototype.update = function() {
    this.aiUpdate("zombie");

    if (this.ability3Timer >= 4) {
        this.healingCircle -= this.game.clockTick;
        this.ability3Timer -= this.game.clockTick;
        this.velocity.x = 0;
        this.velocity.y = 0;
    } else {
        this.ability3Timer = false;
        this.healingCircle = false;
    }

    if (this.ability2Timer) {
        if (this.ability2Timer >= 0) {
            this.ability2Timer -= this.game.clockTick;
            if (this.ability2Check > this.ability2Timer) {
                this.ability2Check -= 1;
                var villain = new Villain(this.game, this.x + this.velocity.x, this.y + this.velocity.y);
                this.game.addEntity(villain);
            }
            this.velocity.x = 0;
            this.velocity.y = 0;
        } else {
            this.ability2Timer = false;
        }
    }

    if (this.ability1Timer) {
        if (this.ability1Timer <= 0) {
            this.ability1Timer = false;
            this.maxSpeed = this.originalMaxSpeed;
            this.movingAnimation.frameDuration = this.movingAnimation.originalFrameDuration;
        } else {
            this.ability1Timer -= this.game.clockTick;
        }
    }

}


// Boss.prototype.update = function () {
//     Entity.prototype.update.call(this);

//     this.x += this.directionX * this.game.clockTick;
//     this.y += this.directionY * this.game.clockTick;

//     if (this.collideLeft() || this.collideRight()) {
//         this.directionX = -this.directionX * friction;
//         if (this.collideLeft()) this.x = this.radius;
//         if (this.collideRight()) this.x = 800 - this.radius;
//         this.x += this.directionX * this.game.clockTick;
//         this.y += this.directionY * this.game.clockTick;
//     }

//     if (this.collideTop() || this.collideBottom()) {
//         this.directionY = -this.directionY * friction;
//         if (this.collideTop()) this.y = this.radius;
//         if (this.collideBottom()) this.y = 800 - this.radius;
//         this.x += this.directionX * this.game.clockTick;
//         this.y += this.directionY * this.game.clockTick;
//     }

//     var chasing = false;
//     for (var i = 0; i < this.game.entities.length; i++) {
//         var ent = this.game.entities[i];
//         if (ent !== this && this.collide(ent)) {
//             if (ent.name === "Zombie") {
//                 var temp = { x: this.directionX, y: this.directionY };

//                 var dist = distance(this, ent);
//                 var delta = this.radius + ent.radius - dist;
//                 var difX = (this.x - ent.x) / dist;
//                 var difY = (this.y - ent.y) / dist;

//                 this.x += difX * delta / 2;
//                 this.y += difY * delta / 2;
//                 ent.x -= difX * delta / 2;
//                 ent.y -= difY * delta / 2;

//                 this.directionX = ent.directionX * friction;
//                 this.directionY = ent.directionY * friction;
//                 ent.directionX = temp.x * friction;
//                 ent.directionY = temp.y * friction;
//                 this.x += this.directionX * this.game.clockTick;
//                 this.y += this.directionY * this.game.clockTick;
//                 ent.x += ent.directionX * this.game.clockTick;
//                 ent.y += ent.directionY * this.game.clockTick;
//             }
//             if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving" && !ent.removeFromWorld) {
//                 ent.removeFromWorld = true;
// //                console.log(ent.name + " kills: " + ent.kills);
//                 var newZombie = new Zombie(this.game, ent);
//                 this.game.addEntity(newZombie);
//             }
//             if (ent.name === "Rock" && ent.thrown) {
//                 ent.removeFromWorld = true;
//                 this.health -= ent.strength;
//                 if (this.health <= 0) {
//                     this.removeFromWorld = true;
//                 }
// //                console.log("My health is " + this.health);
//                 ent.thrown = false;
//                 ent.directionX = 0;
//                 ent.directionY = 0;
//                 ent.thrower.kills++;
//             }
//         }
//         var acceleration = 1000000;

//         if (ent.name !== "Zombie" && ent.name !== "Rock" && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
//             var dist = distance(this, ent);
//             if (dist > this.radius + ent.radius + 2) {
//                 console.log(dist);
//                 var difX = (ent.x - this.x)/dist;
//                 var difY = (ent.y - this.y)/dist;
//                 this.directionX += difX * acceleration / (dist * dist);
//                 this.directionY += difY * acceleration / (dist * dist);
//             }
//             chasing = true;
//         }

        
//     }

//     // if (!chasing) {
//     //     ent = this.game.zombies[randomInt(this.game.zombies.length)];
//     //     var dist = distance(this, ent);
//     //     if (dist > this.radius + ent.radius + 2) {
//     //         var difX = (ent.x - this.x) / dist;
//     //         var difY = (ent.y - this.y) / dist;
//     //         this.directionX += difX * acceleration / (dist * dist);
//     //         this.directionY += difY * acceleration / (dist * dist);
//     //     }
//     // }

//     var speed = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
//     if (speed > this.maxSpeed) {
//         var ratio = this.maxSpeed / speed;
//         this.directionX *= ratio;
//         this.directionY *= ratio;
//     }

//     this.directionX -= (1 - friction) * this.game.clockTick * this.directionX;
//     this.directionY -= (1 - friction) * this.game.clockTick * this.directionY;

//     //console.log(Math.atan(this.directionX / this.directionY)* (180/Math.PI));
//     //this.angle = Math.atan(this.directionX / this.directionY) * (180/Math.PI);
//     //console.log("this.directionX" + this.directionX + "this.directionY" + this.directionY + "this.x" + this.x + "this.y" + this.y);
//     this.angle = Math.atan2(this.directionY , this.directionX) * (180/Math.PI); //-  Math.atan2(this.x , this.y) * (180/Math.PI);
//     //this.angle = Math.atan2(-1 , -1) * (180/Math.PI) -  Math.atan2(0 , 0) * (180/Math.PI);
//     this.angle = this.angle;
//     while (this.angle > 360) {
//         this.angle = this.angle - 360;
//     }
//     //console.log("angle in zombie: " + this.angle);
//     // this.x += this.directionX;
//     // this.y += this.directionY;
//     // this.currentAnimation = this.movingAnimation;
//     // Entity.prototype.update.call(this);

// };

// Boss.prototype.draw = function (ctx) {
//         LivingEntity.prototype.draw.call(this, ctx);
// };
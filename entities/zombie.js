// function Zombie(game, clone) {
//     this.radius = 64;
// 	if (!clone) {
//         LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);
// 		this.x = 850;
// 		this.y = this.game.surfaceHeight * Math.random();
// 	} else {
//         if (clone.x < 0) clone.x = 0;
//         if (clone.y < 0) clone.y = 0;
//         if (clone.x > 800) clone.x = 800;
//         if (clone.y > 800) clone.y = 800;
//         if (clone.x > 0 && clone.y > 0 && clone.x < 800 && clone.y < 800) {
//             LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);            // Entity.call(this, game, clone.x, clone.y);
//         } else {
//             LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);
//         }
//     }
	
// 	this.radius = 64;
// 	this.SpriteHeight = 60;
// 	this.SpriteWidth = 60;
//     this.player = 1;
//     this.radius = 32;
//     this.visualRadius = 10000;
//     this.name = "Zombie";
//     this.color = "Red";

//     this.maxSpeed = minSpeed + (maxSpeed - minSpeed) * Math.random();
//     this.healthMAX = 100;
// 	this.health = this.healthMAX;
//     this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/zombie-moving.png"), this.SpriteHeight, this.SpriteWidth, .05, 25, true, false, 5);
//         // Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
//     // this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
//     // var speed = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
//     // if (speed > this.maxSpeed) {
//     //     var ratio = this.maxSpeed / speed;
//     //     this.directionX *= ratio;
//     //     this.directionY *= ratio;
//     // }

//     this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
//     var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
//     if (speed > this.maxSpeed) {
//         var ratio = this.maxSpeed / speed;
//         this.velocity.x *= ratio;
//         this.velocity.y *= ratio;
//     }

// };

// Zombie.prototype = new LivingEntity();
// Zombie.prototype.constructor = Zombie;

// Zombie.prototype.collide = function (other) {
//     return distance(this, other) < this.radius + other.radius;
// };

// Zombie.prototype.collideLeft = function () {
//     return false;//(this.x - this.radius) < 0;
// };

// Zombie.prototype.collideRight = function () {
//     return false;//(this.x + this.radius) > 800;
// };

// Zombie.prototype.collideTop = function () {
//     return false;//(this.y - this.radius) < 0;
// };

// Zombie.prototype.collideBottom = function () {
//     return false;//(this.y + this.radius) > 800;
// };

// Zombie.prototype.update = function () {
//     Entity.prototype.update.call(this);
//  //  console.log(this.velocity);

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
//             if (ent.name !== "Zombie" && ent.name !== "Flame" && ent.name !== "Rock" && ent.name !== "FlameThrower" && ent.name !== "NonLiving" && !ent.removeFromWorld) {
//                 ent.removeFromWorld = true;
// //                console.log(ent.name + " kills: " + ent.kills);
//                 var newZombie = new Zombie(this.game, ent);
//                 this.game.addEntity(newZombie);
//             }
//             if ((ent.name === "Flame" && ent.thrown) || (ent.thrown && ent.name === "Rock")) {
//                 ent.removeFromWorld = true;
//                 this.health -= ent.strength;
//                 if (this.health <= 0) {
//                     this.removeFromWorld = true;
// 					this.game.kills++;
//                 }
// //                console.log("My health is " + this.health);
//                 ent.thrown = false;
//                 ent.directionX = 0;
//                 ent.directionY = 0;
//                 ent.thrower.kills++;
//             }
//         }
//         var acceleration = 1000000;

//         if (ent.name !== "Zombie" && ent.name !== "Flame" && ent.name !== "Rock" && ent.name !== "NonLiving" && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
//             var dist = distance(this, ent);
//             if (dist > this.radius + ent.radius + 2) {
//                 var difX = (ent.x - this.x)/dist;
//                 var difY = (ent.y - this.y)/dist;
//                 this.directionX += difX * acceleration / (dist * dist);
//                 this.directionY += difY * acceleration / (dist * dist);
//             }
//             chasing = true;
//         }

        
//     }

//     if (!chasing) {
//         ent = this.game.zombies[randomInt(this.game.zombies.length)];
//         var dist = distance(this, ent);
//         if (dist > this.radius + ent.radius + 2) {
//             var difX = (ent.x - this.x) / dist;
//             var difY = (ent.y - this.y) / dist;
//             this.directionX += difX * acceleration / (dist * dist);
//             this.directionY += difY * acceleration / (dist * dist);
//         }

//     }

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
// 	//console.log("this.directionX" + this.directionX + "this.directionY" + this.directionY + "this.x" + this.x + "this.y" + this.y);
// 	this.angle = Math.atan2(this.directionY , this.directionX) * (180/Math.PI); //-  Math.atan2(this.x , this.y) * (180/Math.PI);
// 	//this.angle = Math.atan2(-1 , -1) * (180/Math.PI) -  Math.atan2(0 , 0) * (180/Math.PI);
// 	this.angle = this.angle + 260;
// 	while (this.angle > 360) {
// 		this.angle = this.angle - 360;
// 	}
// 	//console.log("angle in zombie: " + this.angle);
//     // this.x += this.directionX;
//     // this.y += this.directionY;
//     // this.currentAnimation = this.movingAnimation;
//     // Entity.prototype.update.call(this);

// };

//     Zombie.prototype.draw = function (ctx) {
//         LivingEntity.prototype.draw.call(this, ctx);
//     };

// // Zombie.prototype.draw = function (ctx) {
// //     var ctx = ctx.canvas.getContext("2d");
// //     console.log(this.degreeTurnRight);
// //     this.animation.spriteSheet = this.rotateAndCache(ASSET_MANAGER.getAsset("./demon.png"), 1);

// //     // this.rotateAndCache(ASSET_MANAGER.getAsset("./demon.png"), this.degreeTurnRight*Math.PI/180);
// //     // if (this.degreeTurnRight > 360) {
// //     //     this.degreeTurnRight = 0;
// //     // } else {
// //     //     this.degreeTurnRight += 10;
// //     // }
// //     // if (this.jumping) {
// //     //     this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x + 17, this.y - 34);
// //     // }
// //     // else {
// //         this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
// //  //       this.y -= 2;
// //     // }
// //     Entity.prototype.draw.call(this);

// //     ctx.restore();
// //     // ctx.beginPath();
// //     // ctx.fillStyle = this.color;
// //     // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
// //     // ctx.fill();
// //     // ctx.closePath();

// // };

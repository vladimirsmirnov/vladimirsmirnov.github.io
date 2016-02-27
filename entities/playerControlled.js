
// find and replace playerControlled with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/

function playerControlled(game) {
    //LivingEntity.call(this, game, 0, 0, 0, 0, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));  
    // LivingEntity.call(this, game, game.surfaceWidth/2 * Math.random(), game.surfaceHeight/2 * Math.random());

    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 190, y: 213 };
    this.spawnPoints[1] = { x: 659, y: 136 };
    this.spawnPoints[2] = { x: 976, y: 303 };
    this.spawnPoints[3] = { x: 965, y: 706 };
    this.spawnPoints[4] = { x: 167, y: 154 };
    this.spawnPoints[5] = { x: 138, y: 222 };
    this.spawnPoints[6] = { x: 184, y:  283 };
    this.spawnPoints[13] = { x: 190, y: 80 };
    this.spawnPoints[7] = { x: 138, y: 688 };
    this.spawnPoints[8] = { x: 449, y: 672 };
    this.spawnPoints[9] = { x: 136, y: 888 };
    this.spawnPoints[10] = { x: 298, y: 1192};
    this.spawnPoints[11] = { x: 664, y: 416 };
    this.spawnPoints[12] = { x: 190, y: 80 };
    

    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    LivingEntity.call(this, game, spawnpoint.x, spawnpoint.y);

    this.player = 1;
    // this.SpriteWidth = 80;
    // this.SpriteHeight = 43;

    this.SpriteWidth = 110;
    this.SpriteHeight = 176 / 3;

    this.radius = 30;
    this.strength = 100;
    this.controlled = false;
    this.action;
    this.weapon = null;
    this.game = game;
    this.name = "playerControlled";
    this.type = this.name;
    this.color = "Black";
    this.team = "blue";
    this.shootingLine = true;
    this.angleOffset = 0;
    this.radialOffset = 15;

    this.cooldown = 0;
    this.randomLine = {x:0, y:0};
    this.linecooldown = .002;
    this.linecooldownstart = .002;
    this.cooldownStartControlled = .45;
    this.cooldownStartNotControlled = .75;
    this.angleOffset =  290;
    //this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    this.CenterOffsetX = 10; // puts the center of the sprite in the center of the entity
    this.CenterOffsetY = 10; // puts the center of the sprite in the center of the entity
    this.SpriteRotateOffsetX = 8; //describes the point of rotation on the sprite changed from 1/2 width
    this.SpriteRotateOffsetY = -7; //describes the point of rotation on the sprite changed from 1/2 height
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 8, true, false, 3);
    this.velocity = { x: 0, y: 0 };

    this.ability1Attributes.activate = false;

   // this.maxSpeed = 200;

    this.timerForSpeed = 0;
    this.originalSpeed = 100;
};

playerControlled.prototype = new LivingEntity();
playerControlled.prototype.constructor = playerControlled;

playerControlled.prototype.upSpeed = function() {
    this.timerForSpeed = 4; 
    this.maxSpeed = 175;
}

// This function will eventually move to the shooter class.
playerControlled.prototype.attack = function(target) {

    var dir = direction(target, this);
    var shot;
    if (this.weapon === "FlameThrower") {
        shot = new Flame(this.game, this, dir);
    } else {
        shot = new Projectile(this.game);
    }
    shot.x = this.x + dir.x * (this.radius + shot.radius + 20);
    shot.y = this.y + dir.y * (this.radius + shot.radius + 20);
    shot.velocity.x = dir.x * shot.maxSpeed;
    shot.velocity.y = dir.y * shot.maxSpeed;
    //shot.thrown = true;
    shot.thrower = this;
    shot.team = this.team;
    this.game.addEntity(shot);

}


/**
 * Swaps the player controlled if possible and if pressed
 * @param GameEngine to determine if the key has been pressed
 */
playerControlled.prototype.swapIfCanSwap = function(game) {

    var indexOfSwappingPlayerControlled; // the index of the swapping player (1-9)
    var offset = 49; // the offset used to come up with the proper keystate

    // for every number between 1 and 9
    for (var i = 0; i < 9; i++) {

        // IF the number key has been pressed
        if (game.keyState[i + offset]) {
            // assign the indexOfSwappingPlayerControlled to that number
            indexOfSwappingPlayerControlled = i;
        }
    }

    // IF '1' through '9' is pressed
    // AND this.players[whatever-was-pressed - 1]
    // exists,
    // AND the number pressed isn't the currently controlled player
    // then swap control to that PlayerControlled
    // object
    if (indexOfSwappingPlayerControlled !== undefined
        && indexOfSwappingPlayerControlled >= 0
        && indexOfSwappingPlayerControlled <= 57
        && game.players[indexOfSwappingPlayerControlled]
        && !game.players[indexOfSwappingPlayerControlled].controlled) {

        // for every playerControlled object of the gameWipes away the control for all playerControlled Objects of the game
        for(var i = 0; i < game.players.length; i++) {
            // Wipes away the control for all playerControlled Objects of the game
            game.players[i].controlled = false;
        }
        // sets the current controls of the pressed number to controlled
        game.players[indexOfSwappingPlayerControlled].controlled = true;
    }
}

playerControlled.prototype.selectAction = function () {
    if (!this.controlled) {
        return this.aiSelectAction(this.name);
    }

    if (this.controlled) {
        var action = { direction: { x: 0, y: 0 }, willAttack: false, target: null};
        var acceleration = 1000000000;
      
        if (this.game.keyState) {
            var x = 0;
            var y = 0;

            // If the player has pressed a key '1' to '9' then swap players if
            // the other player exists
            this.swapIfCanSwap(this.game);            

            //left
            if (this.game.keyState[37]||this.game.keyState[65]||this.game.keyState[97]) { //leftarrow, a, A
                x = -1;
            }
            //up
            if (this.game.keyState[38]||this.game.keyState[87]||this.game.keyState[119]) {  //uparrow, w, W
                y = -1;
            }
            //right
            if (this.game.keyState[39]||this.game.keyState[68]||this.game.keyState[100]) {  //rightarrow, d, D
                x = 1;
            }
            //down
            if (this.game.keyState[40]||this.game.keyState[83]||this.game.keyState[115]) {  //downarrow, s, S
                y = 1;
            }   
			//pause the game
			if (this.game.keyState[80]||this.game.keyState[112]) {  //p, P
                this.game.menuMode = "Pause";
            }  
            
            action.direction.x += (x) * acceleration;
            action.direction.y += (y) * acceleration;
        }
      
		// console.log(this.game.mouse);
		// console.log(this.game.mouse && this.game.mousedown);
        if (this.game.mouse && this.game.mouse.mousedown) {   
            action.target = this.game.mouse;
            action.willAttack = true;
            //this.game.click = null;
        }
      
        return action;
    }
};


// playerControlled.prototype.aiUpdate = function() {
//     LivingEntity.prototype.update.call(this);
//     // console.log(this.velocity);
//     if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
//     if (this.cooldown < 0) this.cooldown = 0;
//     this.action = this.selectAction();
//     //if (this.cooldown > 0) console.log(this.action);

//     // if (drag.y > action.direction.y) drag.y = action.direction.y;
//     // if (drag.x > action.direction.x) drag.x = action.direction.x;
//     // action.direction.x -= drag.x;
//     // action.direction.y -= drag.y;
//     this.velocity.x += this.action.direction.x;
//     this.velocity.y += this.action.direction.y;
//   //drag
//   var dragPercent = 0.05;
//   this.velocity.x -= this.velocity.x * dragPercent;
//   this.velocity.y -= this.velocity.y * dragPercent;

//     var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
//     if (speed > this.maxSpeed) {
//         var ratio = this.maxSpeed / speed;
//         this.velocity.x *= ratio;
//         this.velocity.y *= ratio;

//     } 
//   // else if (speed < 0) {
//     // this.velocity.x *= 0;
//         // this.velocity.y *= 0;
//   // }


//     this.x += this.velocity.x * this.game.clockTick;
//     this.y += this.velocity.y * this.game.clockTick;

//     if (this.collideLeft() || this.collideRight()) {
//         this.velocity.x = -this.velocity.x * friction;
//         if (this.collideLeft()) this.x = this.radius;
//         if (this.collideRight()) this.x = this.game.map.worldWidth - this.radius;
//         this.x += this.velocity.x * this.game.clockTick;
//         this.y += this.velocity.y * this.game.clockTick;
//     }

//     if (this.collideTop() || this.collideBottom()) {
//         this.velocity.y = -this.velocity.y * friction;
//         if (this.collideTop()) this.y = this.radius;
//         if (this.collideBottom()) this.y = this.game.map.worldWidth - this.radius;
//         this.x += this.velocity.x * this.game.clockTick;
//         this.y += this.velocity.y * this.game.clockTick;
//     }

//     // for (var i = 0; i < this.game.entities.length; i++) {
//     //     var ent = this.game.entities[i];
//     //     if (ent !== this && this.collide(ent)) {
//     //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
//     //             var temp = { x: this.velocity.x, y: this.velocity.y };
//     //             var dist = distance(this, ent);
//     //             var delta = this.radius + ent.radius - dist;
//     //             var difX = (this.x - ent.x) / dist;
//     //             var difY = (this.y - ent.y) / dist;

//     //             this.x += difX * delta / 2;
//     //             this.y += difY * delta / 2;
//     //             ent.x -= difX * delta / 2;
//     //             ent.y -= difY * delta / 2;

//     //             this.velocity.x = ent.velocity.x * friction;
//     //             this.velocity.y = ent.velocity.y * friction;
//     //             ent.velocity.x = temp.x * friction;
//     //             ent.velocity.y = temp.y * friction;
//     //             this.x += this.velocity.x * this.game.clockTick;
//     //             this.y += this.velocity.y * this.game.clockTick;
//     //             ent.x += ent.velocity.x * this.game.clockTick;
//     //             ent.y += ent.velocity.y * this.game.clockTick;
//     //         }
//     //         // if (ent.name === "Rock" && this.rocks < 2) {
//     //             // this.rocks++;
//     //             // ent.removeFromWorld = true;
//     //         // }
//     //     }
//     // }
    
//     var rock;
//     // if (!this.controlled) {
//     //     console.log(this.action);
//     // }
//     if (this.cooldown === 0 && this.action.willAttack) { //&& this.rocks > 0) {
//         if (this.controlled) {
//             this.cooldown = .25;
//         } else {
//             this.cooldown = .75;
//         }
//         //this.rocks--;
//         var target = this.action.target;
//         var dir = null;
//         if (target != null && (this.controlled === true || (target.x < 780 && target.x > 20))) {
//           dir = direction(target, this);
//           this.attack(dir);
//         }        
//     }

//     if (this.action.target) {
//         this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
//         this.angle = this.angle - 100;
//         //console.log(this.angle);
//         while (this.angle > 360) {
//             this.angle = this.angle - 360;
//         }
//     }

//     this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
//     this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
// }

playerControlled.prototype.update = function () {

    console.log(this.x + "  " + this.y);

    if (this.timerForSpeed) {
        if (this.timerForSpeed <= 0) {
            this.timerForSpeed = 0;
            this.maxSpeed = this.originalSpeed;
            console.log(this.maxSpeed);
        } else {
            this.timerForSpeed -= this.game.clockTick;
        }
    }


    if (!this.controlled && !this.removeFromWorld) {
        this.aiUpdate(this.type);
        return;
    }
    LivingEntity.prototype.update.call(this);

    //console.log("location X:" +this.x + "location Y: " + this.y);

    // Weapon collision
    for (i = 0; i < this.game.weapons.length; i++) {
        var weap = this.game.weapons[i];
        if (!(((this.y + 54) < (weap.y)) ||
        (this.y > (weap.y + 20))||
        ((this.x + 54) < weap.x) ||
        (this.x > (weap.x + 50)))) {
            weap.removeFromWorld = true;
            this.weapon = weap.name;
        }
    }
	
    // Item collision
	for (i = 0; i < this.game.items.length; i++) {
        var item = this.game.items[i];
        if (!(((this.y + 54) < (item.y)) ||
        (this.y > (item.y + item.width))||
        ((this.x + 54) < item.x) ||
        (this.x > (item.x + item.height)))) {
            //item action
			item.action(this);           
        }
    }


    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);

    // if (drag.y > action.direction.y) drag.y = action.direction.y;
    // if (drag.x > action.direction.x) drag.x = action.direction.x;
    // action.direction.x -= drag.x;
    // action.direction.y -= drag.y;
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;
  //drag
  var dragPercent = 0.05;
  this.velocity.x -= this.velocity.x * dragPercent;
  this.velocity.y -= this.velocity.y * dragPercent;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    } 
  // else if (speed < 0) {
    // this.velocity.x *= 0;
        // this.velocity.y *= 0;
  // }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = this.game.map.worldWidth - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = this.game.map.worldHeight - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // Removed by Vlad, stupid loop makes the game crash

    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent)) {
    //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
    //             var temp = { x: this.velocity.x, y: this.velocity.y };
    //             var dist = distance(this, ent);
    //             var delta = this.radius + ent.radius - dist;

    //             if (dist) {
    //                 var difX = (this.x - ent.x) / dist;
    //                 var difY = (this.y - ent.y) / dist;


    //                 this.x += difX * delta / 2;
    //                 this.y += difY * delta / 2;
    //                 ent.x -= difX * delta / 2;
    //                 ent.y -= difY * delta / 2;

    //                 this.velocity.x = ent.velocity.x * friction;
    //                 this.velocity.y = ent.velocity.y * friction;
    //                 ent.velocity.x = temp.x * friction;
    //                 ent.velocity.y = temp.y * friction;
    //                 this.x += this.velocity.x * this.game.clockTick;
    //                 this.y += this.velocity.y * this.game.clockTick;
    //                 ent.x += ent.velocity.x * this.game.clockTick;
    //                 ent.y += ent.velocity.y * this.game.clockTick;
    //             }
    //         }
    //         // if (ent.name === "Rock" && this.rocks < 2) {
    //             // this.rocks++;
    //             // ent.removeFromWorld = true;
    //         // }
    //     }
    // }

    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent)) {
    //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
    //             var temp = { x: this.velocity.x, y: this.velocity.y };
    //             var dist = distance(this, ent);
    //             var delta = this.radius + ent.radius - dist;
    //             var difX = (this.x - ent.x) / dist;
    //             var difY = (this.y - ent.y) / dist;

    //             this.x += difX * delta / 2;
    //             this.y += difY * delta / 2;
    //             ent.x -= difX * delta / 2;
    //             ent.y -= difY * delta / 2;

    //             this.velocity.x = ent.velocity.x * friction;
    //             this.velocity.y = ent.velocity.y * friction;
    //             ent.velocity.x = temp.x * friction;
    //             ent.velocity.y = temp.y * friction;
    //             this.x += this.velocity.x * this.game.clockTick;
    //             this.y += this.velocity.y * this.game.clockTick;
    //             ent.x += ent.velocity.x * this.game.clockTick;
    //             ent.y += ent.velocity.y * this.game.clockTick;
    //         }
    //         // if (ent.name === "Rock" && this.rocks < 2) {
    //             // this.rocks++;
    //             // ent.removeFromWorld = true;
    //         // }
    //     }
    // }

    
    var rock;
    var flame;
    // if (!this.controlled) {
    //     console.log(this.action);
    // }
    if (this.cooldown === 0 && this.action.willAttack ) { 
        if (this.controlled && this.weapon === "FlameThrower") {
            this.cooldown = .05;
		}else if (this.controlled) {
			 this.cooldown = .25;
		} else {
            this.cooldown = .75;
        }
        //this.rocks--;
        var target = this.action.target;
        var dir = null;
        if (target != null && (this.controlled === true || (target.x < 780 && target.x > 20))) {
          dir = direction(target, this);
        }        
        if (dir != null) {
            this.attack(target);
          // if (this.weapon === "FlameThrower") {
          // flame = new Flame(this.game, ASSET_MANAGER.getAsset("./images/flame2.png"));
          // flame.x = this.x + dir.x * (this.radius + flame.radius + 20);
          // flame.y = this.y + dir.y * (this.radius + flame.radius + 20);
          // flame.velocity.x = dir.x * flame.maxSpeed;
          // flame.velocity.y = dir.y * flame.maxSpeed;
          // flame.thrown = true;
          // flame.thrower = this;
          // this.game.addEntity(flame);

          // } else {
          // rock = new Projectile(this.game);
          // rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
          // rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
          // rock.velocity.x = dir.x * rock.maxSpeed;
          // rock.velocity.y = dir.y * rock.maxSpeed;
          // rock.thrown = true;
          // rock.thrower = this;
          // rock.team = this.team;
          // this.game.addEntity(rock);
          //   }   
        }
    }

    if (this.action.target) {
        this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
        this.angle = this.angle - 100;
        //console.log(this.angle);
        while (this.angle > 360) {
            this.angle = this.angle - 360;
        }
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
    
    //this.game.setWindowX(this.x - 400);
    //this.game.setWindowY(this.y - 400);
    
    if (flame) {
          var Distance = distance(this, flame);
          console.log(Distance);
          }

    if ((this.velocity.x > -15 && this.velocity.x < 15) && (this.velocity.y > -15 && this.velocity.y < 15)) {
        // this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 1, true, false, 3);
       ///  console.log(this.movingAnimation.frames);
       //  this.movingAnimation.setFrames(1);
         this.movingAnimation = new Animation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 8, true, false, 3);
     } else {
       // console.log("walking");
        // this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 8, true, false, 3);
       // console.log(this.movingAnimation.frames);
      // this.movingAnimation.setFrames(8);
     //  this.movingAnimation = new Animation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 8, true, false, 3);
     }

    // console.log(this.movingAnimation.frames);

    //console.log(this.x + " " + this.y);

};

playerControlled.prototype.draw = function (ctx) {
    if (this.controlled) {
        this.game.setWindowX(this.x - 400);
        this.game.setWindowY(this.y - 400);
    }
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // ctx.fill();
    // ctx.closePath();
    //console.log(this.game.mouse.clientX);

    // ctx.beginPath();
    // ctx.fillStyle = "grey";
    // ctx.arc(300 - this.game.getWindowX(), 300 - this.game.getWindowY(), this.radius, 0, Math.PI * 2, false);
    // ctx.fill();
    // ctx.closePath();

        //shooting line
    if (this.game.mouse && this.shootingLine && this.controlled) {
        ctx.beginPath();
		        // var lineBeginX = this.canvasX + this.radius;
        // var lineBeginY = this.canvasY + this.radius;
		var lineBeginX = this.canvasX;
        var lineBeginY = this.canvasY;
        var lineEndX = this.game.mouse.canvasx;
        var lineEndY = this.game.mouse.canvasy;
        ctx.strokeStyle = "pink";
        ctx.moveTo(lineBeginX,lineBeginY);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();
    }

    if (this.linecooldown > 0 && this.game.mouse.mousedown) this.linecooldown -= this.game.clockTick;
    if (this.linecooldown < 0 || !this.game.mouse.mousedown) this.linecooldown = 0;
    // console.log(this.linecooldown == 0 && this.game.mouse.mousedown);
    // console.log("this.linecooldown " + (this.linecooldown == 0));
    // console.log("this.game.mouse.mousedown " + this.game.mouse.mousedown);
    if ((this.linecooldown == 0) && this.game.mouse.mousedown) {
        this.randomLine.x = Math.random() * 20 - 10;
        this.randomLine.y = Math.random() * 20 - 10;
        this.linecooldown = this.linecooldownstart;
    }


    if (this.game.mouse && this.game.mouse.mousedown && this.controlled) {
        ctx.beginPath();
        // var lineBeginX = this.canvasX + this.radius;
        // var lineBeginY = this.canvasY + this.radius;
		var lineBeginX = this.canvasX;
        var lineBeginY = this.canvasY;
        var lineEndX =  this.game.mouse.canvasx + this.randomLine.x;
        var lineEndY = this.game.mouse.canvasy + this.randomLine.y;
        ctx.strokeStyle = "yellow";
        ctx.moveTo(lineBeginX,lineBeginY);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();
        // console.log(ctx);
        // console.log(document.body);
        // console.log(document.getElementById('gameWorld'));
        //console.log(window);
    }
    
        //this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
    // this.angle = Math.atan2(this.game.y - this.y, this.game.x - this.x) * (180/Math.PI);
    // var dir = direction(this.mouse, this);
    // this.angleOffset = Math.tan(this.radius/dist) * (180/Math.PI);       
    // this.angle = this.angle - 100;
    // console.log(this.angle);
    // while (this.angle > 360) {
        // this.angle = this.angle - 360;
    // }
    
        // ctx.beginPath();
 //    ctx.fillStyle = "grey";
 //    ctx.arc(300 - this.game.getWindowX(), 300 - this.game.getWindowY(), this.radius, 0, Math.PI * 2, false);
 //    ctx.fill();
 //    ctx.closePath();
 
    LivingEntity.prototype.draw.call(this, ctx);
};
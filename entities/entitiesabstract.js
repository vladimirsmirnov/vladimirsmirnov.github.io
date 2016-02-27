// Start Entity Object

/**
 * The Entity object function holds the game.
 * The Entity object can be one of two child objects:
 * Living and NonLiving Entities
 */
function Entity(game, x, y) {
    this.game = game; // add the game to this entity to call rendering
	this.radius = 10; // add the default radius to this entity
    this.x = x; // this is the entity's current x-coordinate location
    this.y = y; // this is the entity's current y-coordinate location
	this.canvasX = x; // this is the entity's current x-coordinate location on the canvas
	this.canvasY = y; // this is the entity's current y-coordinate location on the canvas
	this.isNonLiving = false; // this determines whether the entity is living or non-living. It is defaultly set to non-living

    // if the game exists
    if(this.game) {
        this.ctx = game.ctx; // set the rendering context to the game's rendering context
    }
    this.removeFromWorld = false; // defaultly set the removeFromWorld flag to false
}

/**
 * The update method for all entities.
 * Currently, this only updates the canvasX and canvasY
 * of this Entity if it is not Living
 */
Entity.prototype.update = function () {

    // set the canvasX to this.x minus the position of the x-coordinate of the top-left corner of the canvas
  	this.canvasX = this.x - this.game.getWindowX();
    // set the canvasY to this.y minus the position of the y-coordinate of the top-left corner of the canvas
  	this.canvasY = this.y - this.game.getWindowY();
}

/**
 * Draws the entity
 */
Entity.prototype.draw = function (ctx) {
}

// END ENTITY

// START LIVINGENTITY

/**
 * This is the LivingEntity that moves throughout the game and can cause damage.
 * The following consists of LivingEntities:
 * Characters and Projectiles 
 */
function LivingEntity(game, x, y) {
    Entity.call(this, game, x, y);
	  this.game = game;

	  this.SpriteWidth = 60;  //default:60
	  this.SpriteHeight = 60;  //default:60
	  this.CenterOffsetX = 0; // puts the center of the sprite in the center of the entity
	  this.CenterOffsetY = 0;  //puts the center of the sprite in the center of the entity
	  this.SpriteRotateOffsetX = 0; //describes the point of rotation on the sprite changed from 1/2 width
	  this.SpriteRotateOffsetY = 0; //describes the point of rotation on the sprite changed from 1/2 height

  	this.showHealthBar = true; // determines if the health bar should bo shown or not
  	this.healthBarCoords = {BeginX: 0, BeginY : -10, Width : 50, Height : 7}; // determines the health bar coordinates

  	this.healthMAX = 100; // determines the maximum health this LivingEntity can have
  	this.health = this.healthMAX; // determines the current health of this LivingEntity

    this.radialOffset = 0; // the offset of the radius

  	this.angle = 0; // determines the current angle set on this LivingEntity

    this.strength = 25; // determines the current damage done by this LivingEntity

    this.maxSpeed = maxSpeed; // determines the max speed of this LivingEntity

    this.velocity = { x: 0, y: 0 }; // determines the velocity (movement) that this LivingEntity is currently moving

    this.cooldown = 0; // the cooldown levels for attacks
    this.maxCoolDown = .75; // the max cooldown levels for attacks

    this.ability1Attributes = {
        // cooldowns used to determine whether to unleash ability1 or not
        maxCooldown: 10, 
        cooldown: 10,
        activate: false
    };
    this.ability2Attributes = {
        // cooldown used to determine whether to unleash ability2 or not
        maxCooldown: 8,
        cooldown: 8,
        activate: false
    };
    this.ability3Attributes = {
        // cooldowns used to determine whether to unleash ability3 or not
        maxCooldown: 25,
        cooldown: 25,
        activate: false
    };

    this.angleOffset = 0;

    // AI-used attributes
    this.visualRadius = 800; // the current visualRadius of the LivingEntity
    this.attackRange = 400; // the current attack range that the LivingEntity
    this.approachingDistance = 800; // the distance that determines whether the enemy LivingEntity  is close enough to approach or not
    this.comfortZone = 200; // the comfortable distance between this LivingEntity and an enemy LivingEntity
    this.personalBubble = 200; // this is the personal space needed for this LivingEntity and allied LivingEntities

}

LivingEntity.prototype = new Entity();
LivingEntity.prototype.constructor = LivingEntity;
 
/**
 * This function sets the moving Animation.
 * The moving Animation is the animation that the character
 * does when traversing. All LivingEntities are constantly traversing
 */
LivingEntity.prototype.setMovingAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.movingAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

/**
 * This function sets the attack Animation.
 * The attacking Animation is what occurs when the Character
 * is attacking another Character.
 */
LivingEntity.prototype.setAttackAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.attackAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

/**
 * This function sets the death Animation.
 * The death Animation occurs when a Character is dying.
 */
LivingEntity.prototype.setDeathAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.deathAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

/**
 * This method forces the LivingEntity to be stuck
 * in an Arena. Generally, this is only if you are dealing
 * with a Boss and applies to all playerControlled characters,
 * the Boss, and anything the Boss conjures.
 *
 * @param Object representing the next action an AI will take
 *     takes form { direction: { x: 0, y: 0 }, willAttack: false, target: null}
 * @param int representing the acceleration that is occurring
 *
 * @return Modified Object representing the next action an AI will take
 *     takes form { direction: { x: 0, y: 0 }, willAttack: false, target: null}
 */
LivingEntity.prototype.stuckInArena = function(action, acceleration) {


    // Start Corner Repulsion

    // the coordinates of the coorners of the 
    this.corners = [{x:0, y:0}, // top left corner of canvas
        {x: this.game.surfaceWidth, y:0}, // top right corner of canvas
        {x:0, y: this.game.surfaceHeight}, // bottom left corner of canvas
        {x: this.game.surfaceWidth, y: this.game.surfaceHeight}]; // bottom right corner of canvas

    // prevent the LivingEntity from touching corners
    // for all 4 corners
    for (var i = 0; i < 4; i++) {

        // if the player is too close to a corner
        if (this.collide({
            x: this.corners[i].x, // the corner's x
            y: this.corners[i].y, // the corner's y
            radius: this.visualRadius // the LivingEntitie's visualRadius
          })) {

            dist = distance(this, this.corners[i]); // distance between the corner and this object

            // calculation to repel this LivingEntity from the corner
            var difX = (this.corners[i].x - this.x) / dist;
            var difY = (this.corners[i].y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist);
            action.direction.y -= difY * acceleration / (dist * dist);
        }
    }

    // End Corner Repulsion

    // Wall Repulsion
    var repulsionLevel = 50; // the number of pixels the wall repels the AI

    // if the LivingEntity is too close to the repulsionLevel from either left or right side of the canvas
    if (this.canvasX <= (repulsionLevel)
      || this.canvasX >= this.game.surfaceWidth - repulsionLevel) {

        // create an invisible wall that the LivingEntity is repelled by
        var wall;
        
        // if the x location of the shooter is less than 400px
        if (this.canvasX < (this.game.surfaceWidth / 2)) {
            // let that wall be the left most border of the screen
            wall = {x: this.game.windowX, y: this.y};
        } else {
            // else let that wall be the right most border of the screen
            wall = {x: this.game.windowX + this.game.surfaceWidth, y: this.y};
        }

        // get the distance between this object and the wall created
        var distWall = distance(this, wall);

        // let the difference of the wall help to simulate a magnetic repulsion
        var difX = (wall.x - this.x) / distWall;
        var difY = (wall.y - this.y) / distWall;
        action.direction.x -= difX * acceleration / (distWall * distWall);
        action.direction.y -= difY * acceleration / (distWall * distWall);        
    }

    // if the shooter is too close to the repulsionLevel from either the top or bottom of the canvas
    if (this.y <= repulsionLevel || this.y >= this.game.surfaceHeight - repulsionLevel) {

        // create an invisible wall
        var wall;

        // if the y location of the shooter is less than 400px
        if (this.y < this.game.surfaceHeight / 2) {
            // let that wall be the top border of the canvas
            wall = {x: this.x, y: 0};
        } else {
            // else let that wall be the bottom border of the canvas
            wall = {x: this.x, y: this.game.surfaceHeight };
        }

        // get the distance between this object and the wall created
        var distWall = distance(this, wall);

        // let the difference of the wall help to simulate a magnetic repulsion from the wall        
        var difX = (wall.x - this.x) / distWall;
        var difY = (wall.y - this.y) / distWall;
        action.direction.x -= difX * acceleration / (distWall* distWall);
        action.direction.y -= difY * acceleration / (distWall* distWall);

    }
    return action;
}

/**
 * This is the playerControlled action that is called if the type
 * passed to the aiSelectAction is set to playerControlled
 * 
 * @param Object representing the next action an AI will take
 *     takes form { direction: { x: 0, y: 0 }, willAttack: false, target: null}
 * @param int representing the acceleration that is occurring
 *
 * @return Modified Object representing the next action an AI will take
 *     takes form { direction: { x: 0, y: 0 }, willAttack: false, target: null}
 */
LivingEntity.prototype.playerControlledAiSelectAction = function(action, acceleration) {

    // START KEEP PLAYERCONTROLLED OBJECT AWAY FROM OTHER PLAYERCONTROLLED OBJECTS

    // for every player controlled player on the board
    for (var i = 0; i < this.game.players.length; i++) {

        // get that playable character and the space between it and this playable character
        var playableCharacter = this.game.players[i];
        var space = distance(playableCharacter, this);

        // IF this is not the playable character AND the space is not 0 AND the space smaller than this playable character's personal bubble
        if (this !== playableCharacter && space !== 0 && space < this.personalBubble) {

            // backaway from the other character
            var difX = (playableCharacter.x - this.x) / space;
            var difY = (playableCharacter.y - this.y) / space;
            action.direction.x -= difX * acceleration / (space * space);
            action.direction.y -= difY * acceleration / (space * space);
        }
    }

    // END KEEP PLAYERCONTROLLED OBJECT AWAY FROM OTHER PLAYERCONTROLLED OBJECTS


    // START KEEP PLAYERCONTROLLED OBJECT CLOSE TO PLAYER

    // This will be the PlayerControlled object.
    // There will only ever be one fully PlayerControlled object.
    var player = this.game.getPlayer();

    // This is the highest distance of the space between the Friendly AI
    // and the PlayerControlled objects
    var spaceBetweenPlayerControlled = 275;

    // If the player exists and the player is moving outside of the
    // PlayerControlled object's space.
    if (player && !this.collide({x: player.x, y: player.y, radius: spaceBetweenPlayerControlled})) {

        // Then move the player closer to the Player Controlled Object
        var difX = (player.x - this.x) / spaceBetweenPlayerControlled;
        var difY = (player.y - this.y) / spaceBetweenPlayerControlled;
        action.direction.x += 100 * difX * acceleration / (spaceBetweenPlayerControlled * spaceBetweenPlayerControlled);
        action.direction.y += 100 * difY * acceleration / (spaceBetweenPlayerControlled * spaceBetweenPlayerControlled);
    }

    // END KEEP PLAYERCONTROLLED OBJECT CLOSE TO PLAYER 

    return action;
}

/**
 * This function controls the actions of all living entity AI's
 */
LivingEntity.prototype.aiSelectAction = function(type) {
    
    if (type === undefined) {
       type = "zombie";
    }

    // the current action being
    var action = { direction: { x: 0, y: 0 }, willAttack: false, target: null};
    var acceleration = 1000000000;

    // If this is a playerControlled action request
    if (type === "playerControlled") {
        // then adjust the action
        action = this.playerControlledAiSelectAction(action, acceleration);
    }
//  action = this.stuckInArena(action, acceleration); TODO for Boss fight

    // This is the target that the LivingEntity will seek out
    var target = null;

    // This is the distance which will be used to calculate the target enemy
    var dist;

    // This is the distance of the canvas which determines the closest enemy target to shoot
    var closest = Math.max(this.game.surfaceWidth, this.game.surfaceHeight);

    // for every game entity
    for (var i = 0; i < this.game.entities.length; i++) {

        var ent = this.game.entities[i]; // current entity being cyled through

        // IF the entity does not equal this
        if (ent !== this) {
            // IF the LivingEntity is alive
            if (!ent.isNonLiving) {
                // IF the LivingEntity has a team and team does not equal this LivingEntity's team
                if (this.team !== undefined && this.team !== ent.team) {

                    // IF ent's type is not a projectile
                    if (ent.type !== "projectile") {
                        
                        // Then this Entity is an enemy!
                        // And we must determine if this is our target!
                        dist = distance(ent, this); // distance between this LivingEntity and the enemy LivingEntity

                        // if the distance is closer than the currently closest enemy
                        if (dist < closest) {
                            // reassign the closest distance to this new distance
                            closest = dist;
                            // turn this entity into the new target of this LivingEntity
                            target = ent;
                        }
                    // ELSE IF this is a projectile and the projectile collides with the ent
                    } else if (this.collide(ent)) {
                        // SUBTRACT the strength of this ent from the health of this LivingEntity
                        this.health -= ent.strength;
                        // REMOVE the ent from the world
                        ent.removeFromWorld = true;
                    }


                // ELSE IF this is a part of my team and colliding with this
                } else if (this.team !== undefined && this.team === ent.team) {
                    // IF this LivingEntity has collided with something on its team
                    if (this.collide(ent)) {
                        // IF the entity is a projectile
                        if (ent.type === "projectile") {
                            // REMOVE it from world
                            ent.removeFromWorld = true;
                        // OTHERWISE
                        } else {
                            // set up a temp x and y
                            var temp = { x: this.velocity.x, y: this.velocity.y };

                            // BUMP IT out of the way
                            var dist = distance(this, ent);

                            if (dist !== 0) {
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
                    }
                }
            }
        }
    }


    // IF there exists a target closer than the closest
    // AND the closest enemy LivingEntity is close enough to this LivingEntity
    if (target && this.collide({x: target.x, y: target.y, radius: this.approachingDistance})) {

        // take the target's x and the target's y and divide it by the distance
        // numbers that will generally come out of this would be
        // difX < 1 and around .5 with a comfort zone of 400
        // difY > -1 and around -.4 with a comfort zone of 400
        var difX = (target.x - this.x) / dist;
        var difY = (target.y - this.y) / dist;

        // IF the target is closer than the LivingEntity's comfort zone
        if (this.collide({x: target.x, y: target.y, radius: this.comfortZone})) {
            // add it to the direction of the next move and back away
            action.direction.x -= difX * acceleration * 4 / (dist * dist);
            action.direction.y -= difY * acceleration * 4 / (dist * dist);
        } else {
            // add it to the direction of the next move and get closer to the target
            action.direction.x += difX * acceleration * 2 / (dist * dist);
            action.direction.y += difY * acceleration * 2 / (dist * dist);
        }
    }

    // IF there exists a target
    if (target) {

        action.target = calculateInterceptionPoint(target, target.velocity, this, maxSpeed);
        if (this.playerControlled) {
            console.log(target);
        }
        // IF the target is within the attack range
        if (distance(target, this) < this.attackRange + target.radius) {
            action.willAttack = true;
        }
        if (action.target) {
            action.target.entTarget = target;
        } else {
            action.target = {x: target.x, y: target.y};
        }
    }

    action.direction.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    action.direction.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

    return action;
};

/**
 * Draws the current player if it is being controlled
 * @param ctx rendering object
 */
LivingEntity.prototype.drawPlayer = function(ctx) {
    // Get the radius from the game's x and y minus this LivingEntity's x and y
    var rad = Math.atan2(this.game.y - this.y, this.game.x - this.x);

    // Convert the radians to degrees
    var deg = rad * (180 / Math.PI);
    
    // This is the angle offset that is initially set to 0
    var angleOffset = 0;

    // IF the game's mouse is currently set
    if (this.game.mouse) {

        // Gets the distance of the mouse compared to this LivingEntity's canvasX and canvasY
        var dist = distance(this.game.mouse, {x: this.canvasX, y: this.canvasY});
        // creates the angleOffset from the distance
        angleOffset = Math.tan(this.radius / dist) * (180/Math.PI) - 5;       
    }
    deg -= angleOffset; // subtract the angle's offset by this offset
    
    // draw the current player
    this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.CenterOffsetX - this.game.getWindowX() - this.radialOffset, 
      this.y - this.radius - this.CenterOffsetY - this.game.getWindowY() - this.radialOffset, deg,
      this.SpriteRotateOffsetX, this.SpriteRotateOffsetY);
}

/**
 * Draws a circle around the living entity // MAYBE PULL OUT AS CORE FUNCTION ?
 * @param ctx rendering object used to draw on
 * @param color String representing the color used to color the object
 * @param centerX float representing the center x-coordinate of this circle
 * @param centerY float representing the center y-coordinate of this circle
 * @param radius int representing the radius (default is 5)
 */
LivingEntity.prototype.drawCircle = function(ctx, color, centerX, centerY, radius) {

    if (radius === undefined) {
        radius = 5;
    }
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
}

/**
 * Draws the outlines around the LivingEntity
 * @param ctx used for rendering
 */
LivingEntity.prototype.drawOutlines = function(ctx) {
    this.drawCircle(ctx, "red", this.canvasX, this.canvasY);
    this.drawCircle(ctx, "blue", this.canvasX + this.SpriteWidth/2 + 2, this.canvasY + this.SpriteHeight/2 + 2);    
    this.drawCircle(ctx, "purple", this.canvasX + this.CenterOffsetX, this.canvasY + this.CenterOffsetY);
    this.drawCircle(ctx, "green", this.canvasX + this.SpriteWidth, this.canvasY + this.SpriteHeight);
    this.drawCircle(ctx, "pink", this.canvasX + this.radius, this.canvasY + this.radius);
    this.drawCircle(ctx, "orange", this.canvasX + this.radialOffset, this.canvasY + this.radialOffset);

    this.drawCircle(ctx, "black", this.canvasX, this.canvasY, this.radius);

    // this.drawCircle(ctx, "white", this.canvasX + this.radialOffset, this.canvasY  + this.radialOffset, this.radius);    
    // this.drawCircle(ctx, "white", this.canvasX, this.canvasY, this.radius);

}

/**
 * Draws the health bar above this LivingEntity
 * @param ctx used for rendering
 */
LivingEntity.prototype.drawHealthbar = function(ctx) {

    // draw a black background for the health bar
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(this.healthBarCoords.BeginX + this.canvasX, this.healthBarCoords.BeginY + this.canvasY, this.healthBarCoords.Width, this.healthBarCoords.Height);
    ctx.stroke(); 
    
    // display actual health within health bar
    var tempHealth = this.health; // temp health value

    // IF the health of this LivingEntity is less than its maximum amount of health
    if (tempHealth > this.healthMAX) {
        // SET the temp health to the maximum health
        tempHealth = this.healthMAX;
    // ELSE IF the health of this LivingEnity is less than 0
    } else if (tempHealth < 0) {
        // SET the temp health to 0
        tempHealth = 0;
    }

    var healthPercent = (tempHealth / this.healthMAX); // percentage of max health
    var healthGreenAbove = .7; // green bar show 
    var healthYellowAbove = .4; // yellow bar show

    ctx.beginPath();
    // IF my health percent is above the green percent
    if (healthPercent > healthGreenAbove) {
        // FILL the health bar with green
        ctx.fillStyle = "green";
    // ELSE IF my health percent is above the yellow percent
    }else if (healthPercent > healthYellowAbove) {
        // FILL the health bar with yellow
        ctx.fillStyle = "yellow";
    } else {
        // Otherwise, FILL the health bar with red
        ctx.fillStyle = "red";
    }

    // Determine location of the healthbar
    var calculatex = this.healthBarCoords.BeginX + this.canvasX;
    var calculatey = this.healthBarCoords.BeginY + this.canvasY;
    var calculatewidth = this.healthBarCoords.Width * healthPercent;

    // color the healthbar
    ctx.fillRect(calculatex, calculatey, calculatewidth, this.healthBarCoords.Height);
    ctx.stroke(); 
    
    //outline the health bar in white
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.rect(this.healthBarCoords.BeginX + this.canvasX ,this.healthBarCoords.BeginY + this.canvasY,this.healthBarCoords.Width,this.healthBarCoords.Height);
    ctx.stroke(); 
}

/**
 * This is the draw animation for all LivingEntities
 * @param ctx rendering object to draw on
 */
LivingEntity.prototype.draw = function (ctx) {

    // TODO Frozen power
    // if (this.maxSpeed === 0) {
    //     this.movingAnimation.frozen = true;
    // } else {
    //     this.movingAnimation.frozen = false;
    // }

    // IF this object has a movingAnimation set
    // AND the type of this object is playerControlled
    // AND this.controlled is true
    if (this.movingAnimation && this.type === "playerControlled" && this.controlled === true) {

        // Draws the Player
        this.drawPlayer(ctx);


    } else { // If any uncontrolled LivingEntity
        this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.game.getWindowX() - this.radialOffset, this.y - this.radius - this.game.getWindowY() - this.radialOffset, this.angle);
    }
	
	  // SHOW health bar if set
  	if (this.showHealthBar) {
        this.drawHealthbar(ctx);
  	}

    // SHOW outline if game's showOutlines is true
    if (this.game.showOutlines) {
        this.drawOutlines(ctx);
    }

}

// START DEFAULT COLLIDE METHODS
LivingEntity.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

LivingEntity.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

LivingEntity.prototype.collideRight = function () {
    return (this.x + this.radius) > this.game.map.worldWidth;
};

LivingEntity.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

LivingEntity.prototype.collideBottom = function () {
    return (this.y + this.radius) > this.game.map.worldHeight;
};


LivingEntity.prototype.attack = function(target) {
    if (target.entTarget) {
        target.entTarget.health -= this.strength;
    }
}

/**
 * Flocks all the villains together when there are no more targets available
 */
LivingEntity.prototype.flockTogether = function() {
    var acceleration = 100000;
    ent = this.game.villains[randomInt(this.game.villains.length)];
    var dist = distance(this, ent);
    if (dist > this.radius + ent.radius + 2) {
        var difX = (ent.x - this.x) / dist;
        var difY = (ent.y - this.y) / dist;
        this.velocity.x += difX * acceleration / (dist * dist);
        this.velocity.y += difY * acceleration / (dist * dist);
    }
}

/**
 * Updates the AI
 * @param type of this living entity (default is zombie)
 */
LivingEntity.prototype.aiUpdate = function(type) {

    if (type === undefined) {
       type = "zombie";
    }

    LivingEntity.prototype.update.call(this);

    // IF the cooldown is greater than 0 decrement
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    // IF the cooldown is less than 0, set it to 0
    if (this.cooldown < 0) this.cooldown = 0;

    // SELECT the AI action based off of type
    this.action = this.aiSelectAction(this.type);

    // IF NOT currently attacking
    if (!this.action.willAttack) {
        // INCREMENT the x and y coordinates of this LivingEntity
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // MOVE based off the action's direction
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    // LOWER this.velocity based off of the drag percent
    var dragPercent = 0.05;
    this.velocity.x -= this.velocity.x * dragPercent;
    this.velocity.y -= this.velocity.y * dragPercent;

    // determine the current speed of this object based
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

    // IF the speed of this object is greater than the LivingEntity's maxSpeed greater
    if (speed > this.maxSpeed) {

        // MULTIPLY the current velocity by a ratio to decrease the velocity of this object
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;

    } 

    // IF this object collides with the LEFT or RIGHT
    if (this.collideLeft() || this.collideRight()) {
        // Push the LivingEntity back
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = this.game.map.worldWidth - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // IF this object collides with the TOP or BOTTOM
    if (this.collideTop() || this.collideBottom()) {
        // Push the LivingEntity back
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = this.game.map.worldWidth - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }
    

    // IF the attack cooldown reaches 0 and this action is set to willAttack
    if (this.cooldown === 0 && this.action.willAttack) {
        // SET the attack cooldown to the max cool down
        this.cooldown = this.maxCoolDown;
        // SET the target to the action's target
        var target = this.action.target;

        var borderRange = 20;

        // IF the target is not null
        // AND the target is within the screen
        if (target != null
          && target.x < this.game.map.worldWidth - borderRange && target.x > borderRange
          && target.y < this.game.map.worldHeight - borderRange && target.y > borderRange) {
            // LET loose the attack against the target
            this.attack(target);
        }
    }

    // IF the action has a target TODO
    if (this.action.target && this.type === "playerControlled") {
        // FACE that target
        this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
    } else {
        // OTHERWISE, set angle to current direction
        this.angle = Math.atan2(this.velocity.y, this.velocity.x) * (180/Math.PI);
    }

    this.angle = this.angle + this.angleOffset;
    while (this.angle > 360) {
        this.angle = this.angle - 360;
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
}

/**
 *
 */
LivingEntity.prototype.checkAbility = function(abilityAttributes, ability) {
    if (abilityAttributes.cooldown <= 0 && ((this.type === "playerControlled" && abilityAttributes.activate === true) || this.type !== "playerControlled")) {
        ability(this);
        abilityAttributes.cooldown = abilityAttributes.maxCooldown;
    } else if (abilityAttributes.cooldown > 0) {
        abilityAttributes.cooldown -= this.game.clockTick;
    }
}
/**
 * This is the update function for all living entities.
 */
LivingEntity.prototype.update = function () {

    Entity.prototype.update.call(this);

    // IF a LivingEntity's Health Drops to less than 0
    if (this.health <= 0) {
        // REMOVE it from the world
        this.removeFromWorld = true;
        if (this.game.getPlayer() && this.team != this.game.getPlayer().team) {
            // IF the team of this item is not equal to the team of the player
            this.game.kills++;
            // console.log("the level:" + this.game.kills);
            // console.log("the level:" + this.game.exp);
            // console.log("the expTolevelUp:" + this.game.expToLevelUp);
            if (this.exp !== undefined) {
                 this.game.expEarned  += this.exp;
            }
        }
    }

    if (this.ability1 !== undefined) {
        this.checkAbility(this.ability1Attributes, this.ability1);
    }

    if (this.ability2 !== undefined) {
        this.checkAbility(this.ability2Attributes, this.ability2);
    }

    if (this.ability3 !== undefined) {
        this.checkAbility(this.ability3Attributes, this.ability3);
    }
}


function NonLivingEntity(game, locationX, locationY) {
    Entity.call(this, game, locationX, locationY);
    this.name = "NonLiving";
    this.image = null;
    this.animation = null;
    this.degree = null;
    this.leftImageOffset = 0;
    this.topImageOffset = 0;
}

NonLivingEntity.prototype = new Entity();
NonLivingEntity.prototype.constructor = NonLivingEntity;

NonLivingEntity.prototype.setImage = function (image) {
    this.image = image;
}

/**
 * This function sets the moving Animation.
 * The moving Animation is the animation that the character
 * does when traversing. All LivingEntities are constantly traversing
 */
NonLivingEntity.prototype.setAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.animation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

NonLivingEntity.prototype.setLocation = function (X, Y) {
    Entity.prototype.setLocation.call(this, X, Y);
}

NonLivingEntity.prototype.setNonLiving = function (bool) {
    this.isNonLiving = true;
}

// START DEFAULT COLLIDE METHODS
NonLivingEntity.prototype.collide = function (livingEntity) {
    return distance(this, other) < this.radius + other.radius;
};

var collisionOffset = 3;

NonLivingEntity.prototype.collideTop = function(other) {
    var leftThis = this.x;
    var rightThis = this.x + this.width;
    var topThis = this.y;

    var leftOther = other.x - other.radius + collisionOffset;
    var rightOther = other.x + other.radius - collisionOffset;
    var bottomOther = other.y + other.radius + collisionOffset;
    var topOther = other.y - other.radius - collisionOffset;

    var difference = bottomOther - topThis;
    var checkPoint2 = topThis + difference;

    if (topOther <= topThis && bottomOther == checkPoint2) {
        if (leftOther < leftThis) { // if the other is more left than this
            var checkPoint = leftThis + (leftOther - leftThis);
            if (checkPoint == leftOther) {
                return difference;
            }
        } else {
            var checkPoint = leftOther + (leftThis - leftOther);
            if (checkPoint == leftThis) {
                return difference;
            }
        }
    }
    return false;
};
NonLivingEntity.prototype.collideBottom = function(other) {
    var leftThis = this.x;
    var rightThis = this.x + this.width;
    var topThis = this.y;
    var bottomThis = this.y + this.height;

    var leftOther = other.x - other.radius + collisionOffset;
    var rightOther = other.x + other.radius - collisionOffset;
    var bottomOther = other.y + other.radius + collisionOffset;
    var topOther = other.y - other.radius - collisionOffset;

    var difference = bottomThis - topOther;
    var checkPoint2 = topOther + difference;

    if (bottomOther >= bottomThis && bottomThis == checkPoint2) {
        if (leftOther < leftThis) {
            var checkPoint = leftThis + (leftOther - leftThis);
            if (checkPoint == leftOther) {
                return difference;
            }
        } else {
            var checkPoint = leftOther + (leftThis - leftOther);
            if (checkPoint == leftThis) {
                return difference;
            }
        }
    }
    return false;
};

NonLivingEntity.prototype.collideLeft= function(other) {
    var leftThis = this.x;
    var rightThis = this.x + this.width;
    var topThis = this.y;
    var bottomThis = this.y + this.height;

    var leftOther = other.x - other.radius + collisionOffset;
    var rightOther = other.x + other.radius - collisionOffset;
    var bottomOther = other.y + other.radius + collisionOffset;
    var topOther = other.y - other.radius - collisionOffset;

    var difference = rightOther - leftThis;
    var checkPoint2 = leftThis + difference;

    if (leftOther <= leftThis && rightOther == checkPoint2) {
        if (topOther < topThis) {
            var checkPoint = topThis + (topOther - topThis);
            if (checkPoint == topOther) {
                return difference;
            }
        } else {
            var checkPoint = topOther + (topThis - topOther);
            if (checkPoint == topThis) {
                return difference;
            }
        }
    }
    return false;
};

NonLivingEntity.prototype.collideRight = function(other) {
    var leftThis = this.x;
    var rightThis = this.x + this.width;
    var topThis = this.y;
    var bottomThis = this.y + this.height;

    var leftOther = other.x - other.radius + collisionOffset;
    var rightOther = other.x + other.radius - collisionOffset;
    var bottomOther = other.y + other.radius + collisionOffset;
    var topOther = other.y - other.radius - collisionOffset;

    var difference = rightThis - leftOther;
    var checkPoint2 = leftOther + difference;

    if (rightOther >= rightThis && rightThis == checkPoint2) {
        if (topOther < topThis) {
            var checkPoint = topThis + (topOther - topThis);
            if (checkPoint == topOther) {
                return difference;
            }
        } else {
            var checkPoint = topOther + (topThis - topOther);
            if (checkPoint == topThis) {
                return difference;
            }
        }
    }

    return false;
};

NonLivingEntity.prototype.draw = function (ctx) {
	if (this.movingAnimation) {
        this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.game.getWindowX() - this.radialOffset, this.y - this.radius - this.game.getWindowY() - this.radialOffset, this.angle);
    } else if (this.animation) {
      this.animation.drawFrameRotate(this.game.clockTick, ctx,
        this.x - this.game.getWindowX() - this.leftImageOffset, // Top left's x-coordinate 
        this.y - this.game.getWindowY() - this.topImageOffset, // Top left's y-coordinate
        this.degree);
    } else if (this.image) {
        ctx.drawImage(this.image,
            this.x - this.game.getWindowX() - this.leftImageOffset,
            this.y - this.game.getWindowY() - this.topImageOffset);
    }
    if (this.game.showOutlines) {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(
            this.x  - this.game.getWindowX(), // Top Left corner's x-coordinate
            this.y - this.game.getWindowY(), // Top Left corner's y-coordinate
            this.width, this.height);
        ctx.stroke();

    }
}

NonLivingEntity.prototype.update = function () {
}
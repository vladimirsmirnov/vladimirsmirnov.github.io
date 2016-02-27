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

// TIMER OBJECT START

/**
 * This is the Timer Object
 */
function Timer() {
    this.gameTime = 0; // actual game time
    this.maxStep = 0.05; // used when going away from browser, the step that the clock moves 
    this.wallLastTimestamp = 0; // the last time since the browser was in this tab
}

/**
 * This function increases the game time
 * @return returns the change in game time
 */
Timer.prototype.tick = function () {
    var wallCurrent = Date.now(); // This is the current time
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000; // current time minus last time divided by a thousand to see change in time
    this.wallLastTimestamp = wallCurrent; // wallCurrent becomes new last timestamp
    var gameDelta = Math.min(wallDelta, this.maxStep); // either difference between timestamp or the max step (used for changing tabs)
    this.gameTime += gameDelta; // incrementing the game time by delta
    return gameDelta;
}

// TIMER OBJECT END


// GAMEENGINE OBJECT START

/**
 * This is the Game Engine Object
 */
function GameEngine() {

    // Entities of the Game
    this.entities = []; // All entities of the game
    this.weapons = []; // All the weapons of the game
	this.items = [];
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?


    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;
	this.menuMode = "Start";

    this.zombieCooldownNumInitial = 3;  // how often a zombie will appear initially
    this.zombieCooldown = this.zombieCooldownNumInitial; // the cooldown until the next zombie appears

    this.kills = 0; // this is the number of kills that the player has total

    this.showOutlines = false; // this shows the outline of the entities
    this.ctx = null; // this is the object being used to draw on the map
    this.click = null; // this is the click value (if null, not being clicked)

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not

    this.surfaceWidth = null; // the width of the canvas
    this.surfaceHeight = null; // the height of the canvas

    // FOREST MAP
    // this.worldWidth = 1600; // the width of the world within the canvas FOREST
    // this.worldHeight = 1600; // the height of the world within the canvas FOREST

    // this.mapRatioWidth = 1600; //
    // this.mapRationHeight = 1600;

    // HOSPITAL MAP
    // this.worldWidth = 1400; // the width of the world within the canvas HOSPITAL
    // this.worldHeight = 1350; // the height of the world within the canvas HOSPITAL

    // this.mapRatioWidth = 400;
    // this.mapRatioHeight = 400;

    this.windowX = 0; // This is the x-coordinate of the top left corner of the canvas currently
    this.windowY = 0; // This is the y-coordinate of the top left corner of the canvas currently

    // Quinn's Additions
    this.timer = new Timer(); // this creates the Object Timer for the Game Engine
    this.keyState = {}; // this is the current keystate which is an object that is nothing

    this.expToLevelUp = 10;
    this.level = 1;
    this.expEarned = 0;

}

/**
 * This gets the windowX which is the top left corner's X-coordinate
 * @return float representing windowX
 */
GameEngine.prototype.getWindowX = function() {
    return this.windowX;
}

/**
 * This gets the windowY which is the top left corner's Y-coordinate
 * @return float representing windowY
 */
GameEngine.prototype.getWindowY = function() {
    return this.windowY;
}

/**
 * This sets the windowX which is the top left corner's X-coordinate
 * @param x represented by a float
 */
GameEngine.prototype.setWindowX = function(x) {

    var maxX = this.map.worldWidth - this.surfaceWidth; // World Width minus the Canvas Width | the 1600 - 800  for forest world

    // if the X getting passed in is less than 0, then this.WindowX is less than 0
    if (x < 0) {
        // the canvas's top left corner will be set to 0, and we won't be back passed 0
        this.windowX = 0;

    // else if x is greater than the maxX
    } else if (x > maxX) {

        // then we freeze the canvas's top-left corner's X-Coordinate to the maxX
        this.windowX = maxX;
    } else {

        // we move the canvas's top-left corner with the X-Coordinate
        this.windowX = x;
    }
}

/**
 * This sets the windowY which is the top left corner's Y-coordinate
 * @param y represented by a float
 */
GameEngine.prototype.setWindowY = function(y) {

    var maxY = this.map.worldHeight - this.surfaceHeight; // World Height minus the Canvas Height | the 1600 - 800  for forest world

    // if the Y getting passed in is less than 0, then this.WindowY is less than 0
    if (y < 0) {
        this.windowY = 0;

    // else if y is greater than the maxY
    } else if (y > maxY) {

        // then we freeze the canvas's top-left corner's Y-Coordinate to the maxY
        this.windowY = maxY;
    } else {

        // we move the canvas's top-left corner with the Y-Coordinate
        this.windowY = y;
    }
}

/**
 * @param ctx canvas rendering object
 */
GameEngine.prototype.init = function (ctx) {

    this.ctx = ctx; // this adds the ctx object to the Game Engine
	this.ctx.lostfocus = "False"; //used when detecting if game lost focus.
    window.onblur = function detectLostFocus() { this.document.getElementById('gameWorld').getContext('2d').lostfocus = "True";}
	
	this.surfaceWidth = this.ctx.canvas.width; // this sets the surfaceWidth to the canvas width
    this.surfaceHeight = this.ctx.canvas.height; // this sets the surfaceHeight to the canvas height 

    this.startInput();
	this.setupGameState();
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
		if (that.menuMode == "Game") {
			that.loop();
		} else {//if (that.menuMode == "Start" || that.menuMode == "Pause") {
			that.menuLoop();
		}       
        requestAnimFrame(gameLoop, that.ctx.canvas); 
    })();
}

GameEngine.prototype.restart = function () {
	
    // Entities of the Game
    this.entities = []; // All entities of the game
    this.weapons = []; // All the weapons of the game
	this.items = [];
    // added from 435 ZOMBIE AI Project
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?

    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;

    this.kills = 0; // this is the number of kills that the player has total

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not
	this.keyState = {}; // this is the current keystate which is an object that is nothing

    this.windowX = 0; // This is the x-coordinate of the top left corner of the canvas currently
    this.windowY = 0; // This is the y-coordinate of the top left corner of the canvas currently   
	this.setupGameState();
}

GameEngine.prototype.setupGameState = function () {

    // var background = new Background(this, ASSET_MANAGER.getAsset("./images/background.png"));
//    var boss = new Boss(this, ASSET_MANAGER.getAsset("./images/boss.png"));
    //this.addEntity(boss);
  //  this.addEntity(background);

    // var background = new Background(this, ASSET_MANAGER.getAsset("./images/background.png"));
    // var boss = new Boss(this, ASSET_MANAGER.getAsset("./images/boss.png"));
	

        //     // HOSPITAL MAP
    // this.worldWidth = 1400; // the width of the world within the canvas HOSPITAL
    // this.worldHeight = 1200; // the height of the world within the canvas HOSPITAL

    // this.mapRatioWidth = 400;
    // this.mapRatioHeight = 400;

        // FOREST MAP
    // this.worldWidth = 1600; // the width of the world within the canvas FOREST
    // this.worldHeight = 1600; // the height of the world within the canvas FOREST

    // this.mapRatioWidth = 1600; 
    // this.mapRationHeight = 1600;

    // Map(game, image, name, worldWidth, worldHeight, mapRatioWidth, mapRatioHeight, ratio) 

    var hospital = new Map(this, ASSET_MANAGER.getAsset("./images/hospital.png"), "Hospital", 1400, 1350, 400, 400, 0.5);
     // hospital.addWall(new Wall(this, 38, 132, 70, 210));

    hospital.addWall(new Wall(this, 38, 132, 70, 210));
    hospital.addWall(new Wall(this, 38, 460, 70, 210));
    hospital.addWall(new Wall(this, 275, 0, 95, 115));
    hospital.addWall(new Wall(this, 275, 208, 95, 240));
    hospital.addWall(new Wall(this, 489, 258, 185, 100));
    //hospital.addWall(new Wall(this, 275, 540, 100, 215));
    hospital.addWall(new Wall(this, 370, 258, 385, 55));
    hospital.addWall(new Wall(this, 755, 258, 90, 364));
    hospital.addWall(new Wall(this, 845, 490, 258, 85));
    hospital.addWall(new Wall(this, 910, 450, 130, 40));
    hospital.addWall(new Wall(this, 930, 575, 100, 40));
    hospital.addWall(new Wall(this, 1103, 258, 98, 364));
    hospital.addWall(new Wall(this, 0, 0, 14000, 50));
    hospital.addWall(new Wall(this, 0, 0, 58, 12000));
    hospital.addWall(new Wall(this, 58, 752, 538, 74));
    hospital.addWall(new Wall(this, 398, 826, 168, 40));
    hospital.addWall(new Wall(this, 520, 1240, 168, 40));
    hospital.addWall(new Wall(this, 696, 752, 100, 74));
    hospital.addWall(new Wall(this, 1158, 752, 600, 74));
    hospital.addWall(new Wall(this, 793, 700, 85, 600));
    hospital.addWall(new Wall(this, 1083, 695, 75, 298));
    hospital.addWall(new Wall(this, 1083, 1086, 75, 250));
    hospital.addWall(new Wall(this, 1208, 826, 160, 63));
    hospital.addWall(new Wall(this, 1310, 1190, 300, 800));
    hospital.addWall(new Wall(this, 0, 132, 108, 210));
    hospital.addWall(new Wall(this, 0, 460, 108, 210));
    hospital.addWall(new Wall(this, 275, 0, 95, 113));
    hospital.addWall(new Wall(this, 275, 208, 95, 240));
    hospital.addWall(new Wall(this, 275, 540, 95, 280));
    hospital.addWall(new Wall(this, 275, 258, 505, 55));
    hospital.addWall(new Wall(this, 755, 258, 90, 364));
    hospital.addWall(new Wall(this, 755, 490, 447, 85));
    hospital.addWall(new Wall(this, 1103, 258, 98, 364));
    // hospital.addWall(new Wall(this, 0, 0, 14000, 50));
    // hospital.addWall(new Wall(this, 0, 0, 58, 12000));
    hospital.addWall(new Wall(this, 0, 752, 596, 74));
    hospital.addWall(new Wall(this, 696, 752, 160, 74));
    hospital.addWall(new Wall(this, 1083, 752, 675, 74));
    hospital.addWall(new Wall(this, 793, 700, 85, 675));
    hospital.addWall(new Wall(this, 1083, 695, 75, 298));
    hospital.addWall(new Wall(this, 1083, 1086, 75, 300));
    hospital.addWall(new Wall(this, 180, 970, 78, 400));
    hospital.addWall(new Wall(this, 0, 1280, 14000, 80));

    this.setMap(hospital);

	var flamethrower = new FlameThrower(this, ASSET_MANAGER.getAsset("./images/flamethrower.png"));
    this.addEntity(flamethrower);
	
	var healthpack = new HealthPack(this, ASSET_MANAGER.getAsset("./images/HealthPack.png"));
	healthpack.x = 1280;
	healthpack.y = 1040;
	this.addEntity(healthpack);

    var speed = new Speed(this, ASSET_MANAGER.getAsset("./images/speed.png"));
    this.addEntity(speed);
	
	var player = new playerControlled(this);
    player.controlled = true;
    this.addEntity(player);

    var bossMap = new Map(this, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 800, 800, 800, 0.5);
    bossMap.addVillain(new Boss(this));
    bossMap.isBossMap = true;

    this.addEntity(new Portal(this, 94, 1186, bossMap, 700, 200));
//    this.setMap(bossMap);
    // var player2 = new playerControlled(this);
    // this.addEntity(player2);

    // var player3 = new playerControlled(this);
    // this.addEntity(player3);

    
    //this.addEntity(boss);
  //  this.addEntity(background);

  //  this.addEntity(player2);   
}

/**
 * This is where the input starts
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var that = this;

    var getXandYWithWindowOffset = function(e) {

        // e.clientX is where the mouse's x-coordinate currently is
        // Client Rectangle's Left does not change which is 8
        // This adjusts the X based off of the offset of where we moved
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left + that.getWindowX();

        // e.clientY is where the mouse's y-coordinate currently is
        // Client Rectangle's Top does not change which is 8
        // This adjusts the Y based off of the offset of where we moved
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top + that.getWindowY();

        // e.clientX is where the mouse's x-coordinate currently is
        var canvasx = e.clientX;

        // e.clientY is where the mouse's y-coordinate currently is
        var canvasy = e.clientY;

        // returns offset x and y as well as the current mouse's x and mouse's y
        return {x: x, y: y, canvasx: canvasx, canvasy: canvasy};
    }

    // if the ctx is set on this object
    if (this.ctx) {
        // add function to click event on canvas
        this.ctx.canvas.addEventListener("click", function(e) {

            // the click object is set to the current x and y offset as well as mouse's x and mouse's y
            that.click = getXandYWithWindowOffset(e);

            // prevents the click from doing anything else
            e.stopPropagation();
            e.preventDefault();
        }, false);
        
        // add function to mouse event on canvas
        this.ctx.canvas.addEventListener("mousemove", function(e) {

            // sets the tempmousedown to the current mousedown, which is a boolean
            var tempmousedown = that.mouse.mousedown;

            // the mouse object is set to the current x and y offset as well as mouse's x and mouse's y
            that.mouse = getXandYWithWindowOffset(e); 

            // adds back in the mouse down because it doesn't exit in the return of the getXandYWithWindowOffset(e) call
            that.mouse.mousedown = tempmousedown;

            that.x = that.mouse.x;
            that.y = that.mouse.y;

        }, false);

        // checking to see if the mouse has been released        
        this.ctx.canvas.addEventListener("mouseup", function(e) {      
            
            // mouse has been released and we set mousedown to false
            that.mouse.mousedown = false; 
        }, false);
        
        // checking to see if the mouse has been pressed
        this.ctx.canvas.addEventListener("mousedown", function(e) {

            // mouse has been pressed and we set mousedown to true
            that.mouse.mousedown = true; 
        }, false);
    }

    // adds the keydown press into the window
    window.addEventListener('keydown',function(e){
        // prevents the default event from occuring
        e.preventDefault();
        // adds the keycode key to the value in the array and sets it to true
        that.keyState[e.keyCode] = true;
    },false);

    // adds the keyup press into the window    
    window.addEventListener('keyup',function(e){
        // prevents the default event from occuring
        e.preventDefault();
        // adds the keycode key to the value in the array and sets it to false
        that.keyState[e.keyCode] = false;
    },false);

}

/**
 * This adds entities to the game.
 * No entity will be drawn or updated until it is added.
 * @param entity Object of the game
 */
GameEngine.prototype.addEntity = function (entity) {  
    this.entities.push(entity);
    // TODO Delete this!
    if (entity.name === "FlameThrower") this.weapons.push(entity);
	if (entity.type === "item") this.items.push(entity);
    if (entity.type === "villain") this.villains.push(entity);
    if (entity.name === "playerControlled") this.players.push(entity);
}

/**
 * This is where the GameEngine is drawn
 * @param top
 * @param left
 */
GameEngine.prototype.draw = function (top, left) {

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // // The speed in which the canvas is moving when the player is moving
    // var ratio = 2; //1.2
    // The speed in which the canvas is moving when the player is moving

    // Uses the current map image
    // Uses the current map's ratio, mapRatioHeight, mapRatioWidth to deterine map
    // Changed this.worldWidth and this.worldHeight from 1600 magic numbers
    // Changed this.surfaceWidth and this.surfaceHeight from 800 magic numbers
    // The forest level that is being drawn
    this.ctx.drawImage(this.map.image, this.getWindowX() * this.map.ratio, this.getWindowY() * this.map.ratio, this.map.mapRatioWidth, this.map.mapRatioHeight, 0, 0, this.surfaceWidth, this.surfaceHeight);



    if (this.showOutlines) {
        // this cycles through the walls of the map
        for (var i = 0; i < this.map.walls.length; i++) {
            // to draw them
            this.map.walls[i].draw(this.ctx);
        }
    }

    // this cycles through the entities that exist in the game
    for (var i = 0; i < this.entities.length; i++) {

        // then calls the draw method on the entities and passes the ctx so that they can be drawn
        this.entities[i].draw(this.ctx);
    }

	// draws the number of kills onto the canvas
    this.ctx.beginPath();
    this.ctx.fillStyle = "Red";
    this.ctx.font = "48px serif";
    var message = "Kills: " + this.kills;
    this.ctx.fillText(message, 10, 50);
    this.ctx.stroke(); 
	
    this.ctx.restore();
}

/**
 * Get the PlayerControlled Player
 */
GameEngine.prototype.getPlayer = function() {

    // For every playerControlled Object of the game, cycle through each one
    for (var i = 0; i < this.players.length; i++) {

        // If that playerControlled Object is currently being controlled
        if (this.players[i].controlled) {

            // return that player
            return this.players[i];
        }
    }

    // otherwise return null
    return null;
}

/**
 * This is the update function that updates all the entities' attributes
 */
GameEngine.prototype.update = function () {

    var entitiesCount = this.entities.length; // count of all the different entities in the game

    // this cycles through the walls to check for collissions
    for (var i = 0; i < this.map.walls.length; i++) {
        // to draw them
        this.map.walls[i].update();
    }

    // Sets the player to the current player
    this.player = this.getPlayer();

    if(this.expToLevelUp <= this.expEarned){
        ++this.level;
        console.log("My level is " + this.level);
        this.expToLevelUp *= 2;
    }

    // If the map is not a BossMap
    if (!this.map.isBossMap) {
        this.zombieCooldown -= this.clockTick; // decrements the zombie cooldown by the clock of the game

        // IF the zombieCooldown gets less than 0
        if (this.zombieCooldown < 0) {

            // IF there exists a player on the board
            // AND the player is not removed from world
            if (this.player && !this.player.removeFromWorld) {

                // decrease the zombieCooldownNum
                // exponentially as the distance between the player and the
                // origin of the gameboard goes down 
                var dist = distance(this.player, {x:0, y:0});
                if (dist !== 0) {

                    // the half life used to project the spawn rate of the zombies.
                    var halfLife = 3000;

                    // the formula for the curent zombie cooldown.
                    this.zombieCooldown = this.zombieCooldownNumInitial * Math.pow((1/2), dist / halfLife);
                }

                // Adds the zombie entity to the game
                var zom = new Villain(this);
                this.addEntity(zom);
            }
        }
    }

    // cyles through all of the entities once again
    for (var i = 0; i < entitiesCount; i++) {

        var entity = this.entities[i]; // the current entity

        // if the entity is not removed from world
        if (!entity.removeFromWorld) {

            // update its attributes
            entity.update();
        }
    }

    // cyles through all of the entities backwards
    for (var i = this.entities.length - 1; i >= 0; --i) {
        // if the entities is removed from world
        if (this.entities[i].removeFromWorld) {            
            //check if you defeated the boss
			if (this.entities[i].name == "FinalBoss") {
				this.menuMode = "Win";
			}
			// splice the array from i to 1
			this.entities.splice(i, 1);
        }
    }
    // TODO remove these two arrays; we will not be using them anymore
    for (var i = this.villains.length - 1; i >= 0; --i) {
        if (this.villains[i].removeFromWorld) {
            this.villains.splice(i, 1);
        }
    }
    // for (var i = this.rocks.length - 1; i >= 0; --i) {
        // if (this.rocks[i].removeFromWorld) {
            // this.rocks.splice(i, 1);
        // }
    // }

    // this cycles through the player array backwards
    for (var i = this.players.length - 1; i >= 0; --i) {

        // if the player has been removed from the world
        if (this.players[i].removeFromWorld) {
            // if the player is currently being controlled
            if (this.players[i].controlled) {
                // cycle through the other players
                for (var j = 0; j < this.players.length; j++) {
                    // for the first player that is not removedFromWorld
                    if (!this.players[j].removeFromWorld) {
                        // swap the controls of the player and break out of the loop
                        this.players[j].controlled = true;
                        break;
                    }
                }
            }
            // then splice the players array and remove the player from this array
            this.players.splice(i, 1);
        }
    }
	//if the players array is empty it is game over you lose
	if (this.players.length == 0) {
		this.menuMode = "Lose";
	}
	
}


GameEngine.prototype.setMap = function(map, portal) {
    this.map = map;

    if (this.map !== null) {
       // Removes all the previous villains
       for (var i = 0; i < this.villains.length; i++) {
           // Sets the remove from world for all villains to true
           this.villains[i].removeFromWorld = true;
       }

       // Removes all the previous weapons
       for (var i = 0; i < this.weapons.length; i++) {
            // Sets the remove from world for all weapons to true
            this.weapons[i].removeFromWorld = true;
       }
    }

    // IF there are players in this game
    if (this.players.length > 0 && portal) {
        // set the current player to the portal's Enter X and Enter Y
        var player = this.getPlayer();
        player.x = portal.enterX;
        player.y = portal.enterY;
        player.canvasX = portal.enterX;
        player.canvasY = portal.enterY;
    }

    // Add Villains from Map into the game
    for (var i = 0; i < this.map.villains.length; i++) {
        // Add Villains from Map into the game
        this.addEntity(this.map.villains[i]);
    }

    // Adds Weapons from Map into the game
    for (var i = 0; i < this.map.weapons.length; i++) {
        // Add Weapons from Map into the game
        this.addEntity(this.map.weapons[i]);
    }
}

GameEngine.prototype.drawMenu = function() {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	if (this.menuMode == "Start") {
		var height = 50;
		var width = 200;
		
		//startButton
		this.startButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};	
		this.startButton.lines = ["New Game"];
		
		
		this.drawButton(this.startButton);
	} else if (this.menuMode == "Pause") {
		var height = 50;
		var width = 200;
		
		//startButton
		this.continueButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};	
		this.continueButton.lines = ["Continue"];
		
		var buttX = this.continueButton.x;//this.ctx.canvas.width/2 - width/2; 
		var buttY = this.continueButton.y + this.continueButton.height + 30;
		this.startButton = {x:buttX, y:buttY, height:height, width:width};	
		this.startButton.lines = ["New Game"];
		
		this.drawButton(this.continueButton);
		this.drawButton(this.startButton);
		
	} else if (this.menuMode == "Lose") {
		//console.log("lost game");
		var height = 200;
		var width = this.ctx.canvas.width/2 - 100;
		
		this.drawMessage ("GAME OVER", height, width);
		this.drawMessage ("you lost.", height + 30, width);
		
		height = 50;
		width = 200;
		
		//okButton
		this.okButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};	
		this.okButton.lines = ["Ok"];
		this.drawButton(this.okButton);
	} else if (this.menuMode == "Win") {
		
		var height = 200;
		var width = this.ctx.canvas.width/2 - 100;
		
		this.drawMessage ("GAME OVER", height, width);
		this.drawMessage ("You Win!!", height + 30, width);
		
		height = 50;
		width = 200;
		
		//okButton
		this.okButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};	
		this.okButton.lines = ["Ok"];
		this.drawButton(this.okButton);
	}	

}

GameEngine.prototype.drawMessage = function(messageToDraw, startY, startX) {
		this.ctx.save();
		this.ctx.fillStyle = "white";
		this.ctx.font="25px Arial";

		this.ctx.fillText(messageToDraw, startX, startY);
}

GameEngine.prototype.drawButton = function(buttonToDraw) {
	this.ctx.save();
	
	this.ctx.beginPath();
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(buttonToDraw.x, buttonToDraw.y, buttonToDraw.width, buttonToDraw.height);
    this.ctx.fill();
    this.ctx.closePath();
	
	this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.rect(buttonToDraw.x, buttonToDraw.y, buttonToDraw.width, buttonToDraw.height);
    this.ctx.stroke();
    this.ctx.closePath();
	
	this.ctx.fillStyle = "white";
	this.ctx.font="25px Arial";

	for (var i = 0; i < buttonToDraw.lines.length; i++) {
		var startX = buttonToDraw.x + buttonToDraw.width/2 - (buttonToDraw.lines[i].length/2 * 15);
		var startY = buttonToDraw.y + (33 * (i + 1));
		this.ctx.fillText(buttonToDraw.lines[i], startX, startY);
	};
	
	// this.ctx.beginPath();
    // this.ctx.fillStyle = "orange";
    // this.ctx.fillRect(buttonToDraw.x, buttonToDraw.y, 5, 5);
    // this.ctx.fill();
    // this.ctx.closePath();
	
	// this.ctx.fillText(line1,this.startButton.x + 32,this.startButton.y + 30);	
	// this.ctx.fillText(line2,this.startButton.x + 35,this.startButton.y + 60);
	// this.ctx.fillText(line3,this.startButton.x + 38,this.startButton.y + 90);
    this.ctx.restore();
}

GameEngine.prototype.checkMenuClick = function (buttonToTest){
	return(this.click.canvasx >= buttonToTest.x && this.click.canvasx <= buttonToTest.x + buttonToTest.width && this.click.canvasy >= buttonToTest.y && this.click.canvasy <= buttonToTest.y + buttonToTest.height)
}

// GameEngine.prototype.checkMenuClick = function (x, y, width, height){
	// console.log(this.click.x >= x);
	// console.log(this.click.x <= x + width);
	// console.log(this.click.y >= y);
	// console.log(this.click.y <= y + height);
	// return(this.click.x >= x && this.click.x <= x + width && this.click.y >= y && this.click.y <= y + height)
// }

function printout() {
    console.log("printout called");
}

GameEngine.prototype.menuLoop = function () {
	//console.log(window);
	//console.log(document);
	//console.log(window.onblur);
	//window.onblur = function setMenuMode() { console.log("printout called");}
	//window.onblur = function setMenuMode() { console.log(this.document.getElementById('gameWorld').getContext('2d'));console.log(this.document.getElementById('gameWorld').getContext('2d').test = "now");console.log("printout called");}
		//window.onblur = function setMenuMode() { this.menuMode = "Pause";console.log("printout called");}

	// console.log(document.getElementById('gameWorld'));
	// console.log(document.getElementById('gameWorld').style);
	//console.log(document.getElementById('gameWorld').style.cursor = 'pointer');
	document.getElementById('gameWorld').style.cursor = 'pointer';
	//console.log(document.getElementById('gameWorld')._proto_;
	this.drawMenu();
	
	//if there is a click, see if it clicked a button
	//console.log(this.click);
	if (this.click != null) {
		//console.log(this.click);
		//console.log(this.menuMode);
		if (this.menuMode == "Start") {
			//console.log(this.checkMenuClick(this.startButton));
			//console.log(this.click);
			//console.log(this.startButton);
			if (this.checkMenuClick(this.startButton)){
				//console.log("should be starting");
				this.restart();
				document.getElementById('gameWorld').style.cursor = '';
				this.menuMode = "Game";				
			}
			// } else if (this.checkMenuClick(this.restartButton)){
				// this.restart();
				// console.log(document.getElementById('gameWorld').style.cursor = 'url("./images/cursor.png")');
				// this.menuMode = "Game";
			// }
		} else if (this.menuMode == "Pause") {
			if (this.checkMenuClick(this.continueButton)){
				//console.log("should be continuing");
				document.getElementById('gameWorld').style.cursor = '';
				this.menuMode = "Game";
			} else if (this.checkMenuClick(this.startButton)){
				//console.log("should be restarting");
				this.restart();
				document.getElementById('gameWorld').style.cursor = '';
				this.menuMode = "Game";
			}
		} else if (this.menuMode == "Lose" || this.menuMode == "Win") {
			if (this.checkMenuClick(this.okButton)){								
				this.menuMode = "Start";
			}
		} else if (this.menuMode == "EndLevel") {
			if (this.checkMenuClick(this.okButton)){
				//increment level
			}
		}
		
	}
	
	// if (this.click != null) {
		// //console.log(this.click);
		// if (this.checkMenuClick(this.startButton)){
			// this.menuMode = "Game";
		// }
		// // if (this.click.x >= this.startButton.x && 
		// // this.click.x <= this.startButton.x + this.startButton.width &&
		// // this.click.y >= this.startButton.y && 
		// // this.click.y <= this.startButton.y + this.startButton.height) {
			
			// // //this.showMenu = false;
			// // //this.FirstMenu = false;
			// // //this.reset();
		// // }
	// }
    //this.clockTick = this.timer.tick(); // increments the clock tick
    //this.update(); // updates the GameEngine and all the entities in the game
    //this.draw(); // draws the GameEngine and all the entities in the game
    this.click = null; // resets the click to null
}

/**
 * This loops through the game engine until the game ends
 */
GameEngine.prototype.loop = function () {
	//pauses the game if game looses focus
	// if (this.click != null) {
		// console.log(this.click);
	// }

	if (this.ctx.lostfocus == "True") {
		//console.log("lostfocus");
		this.ctx.lostfocus = "False";
		//this.menuMode = "Pause";
	}
    this.clockTick = this.timer.tick(); // increments the clock tick

    this.update(); // updates the GameEngine and all the entities in the game

	this.draw(); // draws the GameEngine and all the entities in the game
    this.click = null; // resets the click to null
}
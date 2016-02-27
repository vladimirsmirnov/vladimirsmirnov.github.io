function Map(game, image, name, worldWidth, worldHeight, mapRatioWidth, mapRatioHeight, ratio) {

	  this.game = game;
	  this.image = image;
	  this.name = name;
	  this.ratio = ratio;

	  this.walls = [];

    this.worldWidth = worldWidth; 
    this.worldHeight = worldHeight; 

    this.mapRatioWidth = mapRatioWidth;
    this.mapRatioHeight = mapRatioHeight;

    this.villains = [];
    this.weapons = [];
    this.isBossMap = false;
}

Map.prototype.addWall = function (wall) {
	 this.walls.push(wall);
}

Map.prototype.addVillain = function(villain) {
    this.villains.push(villain);
}

Map.prototype.addWeapon = function(weapon) {
    this.weapons.push(weapon);
}
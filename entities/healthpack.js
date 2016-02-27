function HealthPack(game, image) {
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;
    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 500, y: 1150 };
    this.spawnPoints[1] = { x: 1270, y: 1050 };
    this.spawnPoints[2] = { x: 970, y: 335 };

    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    this.x = spawnpoint.x;
    this.y = spawnpoint.y;
    this.width = 46;
    this.height = 31;

    this.canvasX = spawnpoint.x;
    this.canvasY = spawnpoint.y;

    this.radius = 40;
    this.name = "HealthPack";
    this.type = "item";
}

HealthPack.prototype = new NonLivingEntity();
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.update = function () {
}

HealthPack.prototype.action = function (player) {
	if (player.health < player.healthMAX) {
		this.removeFromWorld = true;
		player.health += 50;
		if (player.health > player.healthMAX) {
			player.health = player.healthMAX;
		}
	}
}

HealthPack.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);
}

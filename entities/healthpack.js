function HealthPack(game, image) {
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;
    this.x = 100;
    this.y = 100;
    this.width = 46;
    this.height = 31;

    this.canvasX = 100;
    this.canvasY = 100;

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

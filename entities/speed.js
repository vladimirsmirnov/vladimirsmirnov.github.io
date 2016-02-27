function Speed(game, image) {
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;

    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 640, y: 450 };
    this.spawnPoints[1] = { x: 1300, y: 700 };
    this.spawnPoints[2] = { x: 1000, y: 1170 };


    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    this.x = spawnpoint.x;
    this.y = spawnpoint.y;
    this.width = 35;
    this.height = 35;

    this.canvasX = spawnpoint.x;
    this.canvasY = spawnpoint.y;

    this.radius = 40;
    this.name = "Speed";
    this.type = "item";

    // this.x = 200;
    // this.y = 600;
    // console.log(this.x);
    // console.log(this.y);

}

Speed.prototype = new NonLivingEntity();
Speed.prototype.constructor = Speed;

Speed.prototype.update = function () {
}

Speed.prototype.action = function (player) {
      player.upSpeed();
      this.removeFromWorld = true;
}

Speed.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);
}

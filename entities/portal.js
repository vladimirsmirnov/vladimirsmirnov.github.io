function Portal(game, x, y, map, enterX, enterY) {

    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.game = game;
    this.setAnimation(ASSET_MANAGER.getAsset("./images/portal.png"), 65, 66, .1, 4, true, false, 4);
    this.map = map;
    // TODO USE THIS?? this.mapIndex

    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;

    this.enterX = enterX;
    this.enterY = enterY;

    this.leftImageOffset = 10;
    this.topImageOffset = 10;
    this.radius = 30; // TODO remove this
    this.name = "Portal";
    this.type = "portal";

}

Portal.prototype = new NonLivingEntity();
Portal.prototype.constructor = Portal;

Portal.prototype.enter = function (other) {
    return (this.x <= other.x + other.radius) // in left side
            && (this.x + this.width >= other.x - other.radius) // in right side
            && (this.y <= other.y + other.radius) // in top
            && (this.y + this.height >= other.y - other.radius); // in bottom
}

Portal.prototype.update = function () {
    var player = this.game.getPlayer();
    if (player && this.enter(player)) {
        console.log("Entered Portal");
        this.game.setMap(this.map, this);
        this.removeFromWorld = true;
    }
}

Portal.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
}
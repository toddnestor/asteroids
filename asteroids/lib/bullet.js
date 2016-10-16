const Utils = require('./utils');
const Asteroid = require('./asteroid');
const MovingObject = require('./moving_object');

function Bullet(vel, game) {
  options = { pos: game.ship.pos.slice(0), vel: vel, color: '#00FF00', radius: 5, game: game }
    MovingObject.call(this, options);
}

Utils.inherits(Bullet, MovingObject);

Bullet.prototype.isWrappable = false;

Bullet.prototype.collideWith = function(otherObject) {
  if(otherObject instanceof Asteroid) {
    this.game.remove(otherObject);
    this.game.remove(this);
    this.game.ship.score += Math.round(otherObject.radius);
  }
}

module.exports = Bullet;

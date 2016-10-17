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
    if(otherObject.radius >= 30) {
      let halfRadius = otherObject.radius/2;
      let oldVel = otherObject.vel;
      let oldPos = otherObject.pos;
      let new_vel1 = [oldVel[0] + oldVel[1]/2, oldVel[1]];
      let new_vel2 = [oldVel[0], oldVel[1] + oldVel[0]/2];
      let new_pos1 = [oldPos[0] - halfRadius, oldPos[1] - otherObject.radius/2];
      let new_pos2 = [oldPos[0] + halfRadius, oldPos[1] + otherObject.radius/2];
      this.game.add(new Asteroid(this.game, new_pos2, new_vel1, halfRadius));
      this.game.add(new Asteroid(this.game, new_pos1, new_vel2, halfRadius));
    }
    this.game.remove(otherObject);
    this.game.remove(this);
    this.game.ship.score += Math.round(otherObject.radius);
  }
}

module.exports = Bullet;

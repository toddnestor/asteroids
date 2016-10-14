const Utils = require('./utils');
const Asteroid = require('./asteroid');
const MovingObject = require('./moving_object');

function Bullet(game) {
  options = { pos: game.ship.pos.slice(0), vel: Bullet.getVelocity(game), color: '#00FF00', radius: 5, game: game }
    MovingObject.call(this, options);
}

Utils.inherits(Bullet, MovingObject);

Bullet.getVelocity = function(game) {
  let ship_vel = game.ship.vel.slice(0);
  return ship_vel.map( n => {
    if( n == 0 ) {
      return 3;
    } else {
      return n*5
    }
  })
}

Bullet.prototype.collideWith = function(otherObject) {
  console.log('we collided', otherObject);
  if(otherObject instanceof Asteroid) {
    console.log('should be removing');
    this.game.remove(otherObject);
  }
}

module.exports = Bullet;

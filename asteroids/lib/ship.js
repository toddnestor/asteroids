const Utils = require('./utils');
const Bullet = require('./bullet');
const MovingObject = require('./moving_object');

function Ship(pos, game) {
  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 20, game: game }
  MovingObject.call(this, options);
}

Utils.inherits(Ship , MovingObject);

Ship.prototype.relocate = function() {
  this.pos = Utils.randomVec(800);
  this.vel = [0,0];
}

Ship.prototype.power = function(impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
}

Ship.prototype.fireBullet = function() {
  bullet = new Bullet(this.game)
  this.game.add(bullet);
}

module.exports = Ship;

const Utils = require('./utils');
const Bullet = require('./bullet');
const MovingObject = require('./moving_object');

function Ship(pos, game) {
  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 30, game: game }
  this.direction = 0;
  this.lives_lost = 0;
  MovingObject.call(this, options);
}

Utils.inherits(Ship , MovingObject);

Ship.prototype.relocate = function() {
  this.pos = Utils.randomVec(800);
  this.direction = 0;
  this.lives_lost += 1;
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

Ship.prototype.rotatedPos = function(pos) {
  return this.rotate(pos, this.direction);
}

Ship.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  let x = this.pos[0];
  let y = this.pos[1];
  let r = this.radius;

  let p1 = this.rotatedPos([x, y + r]);
  let p2 = this.rotatedPos([x + r/2, y - r]);
  let p3 = this.rotatedPos([x - r/2, y - r]);

  ctx.moveTo(...p1);
  ctx.lineTo(...p2);
  ctx.lineTo(...p3);

  ctx.fill();
}

Ship.prototype.collideWith = function(otherObject) {
  if(otherObject.constructor.name == 'Asteroid') {
    otherObject.collideWith(this);
  }
}

module.exports = Ship;

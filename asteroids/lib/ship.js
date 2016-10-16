const Utils = require('./utils');
const Bullet = require('./bullet');
const MovingObject = require('./moving_object');

function Ship(pos, game) {
  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 30, game: game }
  this.direction = 90;
  this.lives_lost = 0;
  this.power = 0;
  MovingObject.call(this, options);
}

Utils.inherits(Ship , MovingObject);

Ship.prototype.relocate = function() {
  this.pos = Utils.randomVec(800);
  this.direction = 90;
  this.reset();
}

Ship.prototype.reset = function() {
  this.lives_lost += 1;
  this.vel = [0,0];
  this.power = 0;
}

Ship.prototype.fireBullet = function() {
  let power = this.power * 1.2;
  if(power < 0) power = 0;

  let vel = Utils.findNewPoint(0, 0, this.direction, (power + 5));
  vel = [vel[0], -vel[1]];
  bullet = new Bullet(vel, this.game)
  this.game.add(bullet);
}

Ship.prototype.slope = function() {
  return Math.tan(Utils.radians(this.direction));
}

Ship.prototype.newVel = function(x = 0, y = 0) {
  let vel = Utils.findNewPoint(x, y, this.direction, this.power);

  return [vel[0], -vel[1]];
}

Ship.prototype.changePower = function(amount) {
  this.power += amount;
  this.vel = this.newVel();
}

Ship.prototype.changeDirection = function(direction) {
  this.direction += direction;
  this.vel = this.newVel();
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

  let p1 = this.rotatedPos([x + r, y]);
  let p2 = this.rotatedPos([x - r, y + r/2]);
  let p3 = this.rotatedPos([x - r, y - r/2]);

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

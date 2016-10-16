const Utils = require('./utils');
const Bullet = require('./bullet');
const MovingObject = require('./moving_object');
let lastBulletFired = null;

function Ship(pos, game) {
  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 30, game: game }
  this.direction = 90;
  this.lives_remaining = 5;
  this.asteroids_destroyed = 0;
  this.bullets_fired = 0;
  this.power = 0;
  this.score = 0;
  MovingObject.call(this, options);
}

Utils.inherits(Ship , MovingObject);

Ship.prototype.MAX_POWER = 15;
Ship.prototype.MIN_POWER = -Ship.prototype.MAX_POWER;
Ship.prototype.MIN_TIME_BETWEEN_BULLETS = 100;

Ship.prototype.showStats = function() {
  document.getElementById('lives-lost').innerHTML = this.lives_remaining;
  document.getElementById('asteroids-destroyed').innerHTML = this.asteroids_destroyed;
  document.getElementById('bullets-fired').innerHTML = this.bullets_fired;
  document.getElementById('score').innerHTML = this.score;
}

Ship.prototype.relocate = function() {
  this.pos = Utils.randomVec(800);
  this.direction = 90;
  this.reset();
}

Ship.prototype.reset = function() {
  this.lives_remaining -= 1;
  this.vel = [0,0];
  this.power = 0;
}

Ship.prototype.fireBullet = function() {
  let time = new Date();
  if( !lastBulletFired || time - lastBulletFired > this.MIN_TIME_BETWEEN_BULLETS) {
    lastBulletFired = time;
    let power = this.power * 1.2;
    if(power < 0) power = 0;
    this.bullets_fired += 1;

    let vel = Utils.findNewPoint(0, 0, this.direction, (power + 5));
    vel = [vel[0], -vel[1]];
    bullet = new Bullet(vel, this.game)
    this.game.add(bullet);
  }
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
  if( this.power > this.MAX_POWER ) {
    this.power = this.MAX_POWER;
  } else if(this.power < this.MIN_POWER ) {
    this.power = this.MIN_POWER;
  }
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

const Utils = require('./utils');
const Bullet = require('./bullet');
const MovingObject = require('./moving_object');
let lastBulletFired = null;

function Ship(pos, game) {
  options = { pos: pos, vel: [0,0], color: '#42abb1', radius: 30, game: game }
  this.direction = 0;
  this.lives_remaining = 10;
  this.asteroids_destroyed = 0;
  this.bullets_fired = 0;
  this.power = 0;
  this.score = 0;
  this.lastRelocated = new Date();
  MovingObject.call(this, options);
}

Utils.inherits(Ship , MovingObject);
Ship.prototype.MAX_POWER = 15;
Ship.prototype.MIN_POWER = -Ship.prototype.MAX_POWER;
Ship.prototype.MIN_TIME_BETWEEN_BULLETS = 100;

Ship.prototype.showStats = function(ctx) {
  ctx.fillStyle = "white";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`Lives Remaining: ${this.lives_remaining}   Asteroids Destroyed: ${this.asteroids_destroyed}   Score: ${this.score}`, 15, 25);
}

Ship.prototype.relocate = function() {
  this.lastRelocated = new Date();
  this.pos = [this.game.DIM_X / 2, this.game.DIM_Y / 2];
  this.direction = 90;
  this.reset();
}

Ship.prototype.canBeHit = function() {
  let now = new Date();
  return now - this.lastRelocated > 1500;
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

    let vel = Utils.findNewPoint(0, 0, this.direction, 30);
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

Ship.prototype.drawShip = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  let x = this.pos[0];
  let y = this.pos[1];
  let r = this.radius;

  let p1 = [x + r, y];
  let p2 = [x - r, y + r/4];
  let p3 = [x - r, y - r/4];

  let bezConX1 = x + this.radius / 4;
  let bezConY1 = y + (this.radius / 3 * 2);
  let bezConX2 = x - this.radius / 3;
  let bezConY2 = y + (this.radius / 3 * 2);

  let invBezConX2 = x + this.radius / 4;
  let invBezConY2 = y - (this.radius / 3 * 2);
  let invBezConX1 = x - this.radius / 3;
  let invBezConY1 = y - (this.radius / 3 * 2);

  p1 = this.rotatedPos(p1);
  p2 = this.rotatedPos(p2);
  p3 = this.rotatedPos(p3);

  let bezCon1 = this.rotatedPos([bezConX1, bezConY1]);
  let bezCon2 = this.rotatedPos([bezConX2, bezConY2]);
  let invBezCon1 = this.rotatedPos([invBezConX1, invBezConY1]);
  let invBezCon2 = this.rotatedPos([invBezConX2, invBezConY2]);

  ctx.moveTo(...p1);
  ctx.bezierCurveTo(...bezCon1, ...bezCon2, ...p2);
  ctx.lineTo(...p3);
  ctx.bezierCurveTo(...invBezCon1, ...invBezCon2, ...p1);

  let circleX = x + (this.radius/3);
  let circleY = y;
  let circleCenter = this.rotatedPos([circleX, circleY]);

  ctx.fill();

  ctx.fillStyle = '#accf57';
  ctx.beginPath();

  ctx.arc(
    circleCenter[0],
    circleCenter[1],
    this.radius / 4.5,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
  let fin1Start = this.rotatedPos([invBezConX1, invBezConY1 + this.radius / 5]);
  let fin1Corner = this.rotatedPos([x - this.radius - this.radius/2, y - this.radius/2]);
  let finBezCon1X = invBezConX1 - this.radius/3;
  let finBezCon1Y = (invBezConY1 + this.radius / 5) - this.radius/2;
  let finBezCon1 = this.rotatedPos([finBezCon1X, finBezCon1Y]);
  let fin2BezCon1 = this.rotatedPos([finBezCon1X - this.radius/2, finBezCon1Y + this.radius/2]);

  let finBezCon2X = finBezCon1X - this.radius/3;
  let finBezCon2 = this.rotatedPos([finBezCon2X, finBezCon1Y]);
  let fin2BezCon2 = this.rotatedPos([finBezCon2X, finBezCon1Y + this.radius/2]);

  ctx.moveTo(...fin1Start);
  ctx.bezierCurveTo(...finBezCon1, ...finBezCon2, ...fin1Corner);
  ctx.bezierCurveTo(...fin2BezCon1, ...fin2BezCon2, ...p3);
  ctx.fill();

  let fin2Start = this.rotatedPos([invBezConX1, bezConY1 - this.radius / 5]);
  let fin2Corner = this.rotatedPos([x - this.radius - this.radius/2, y + this.radius/2]);
  let fin2Con1Y = (bezConY2 - this.radius / 5) + this.radius/2;
  let fin2Con1 = this.rotatedPos([finBezCon1X, fin2Con1Y]);
  let fin2Con2 = this.rotatedPos([finBezCon2X, fin2Con1Y]);

  let fin2bCon1 = this.rotatedPos([finBezCon1X - this.radius/2, fin2Con1Y - this.radius/2]);
  let fin2bCon2 = this.rotatedPos([finBezCon2X, fin2Con1Y - this.radius/2]);
  ctx.moveTo(...fin2Start);
  ctx.bezierCurveTo(...fin2Con1, ...fin2Con2, ...fin2Corner);
  ctx.bezierCurveTo(...fin2bCon1, ...fin2bCon2, ...p2);
  // ctx.lineTo(...p2);
  ctx.fill();

  ctx.fillStyle = '#023b4e';
  ctx.beginPath();
  ctx.arc(
    circleCenter[0],
    circleCenter[1],
    this.radius / 6,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
}

Ship.prototype.blinkOn = function() {
  let now = new Date();
  let difference = now - this.lastRelocated;

  let hundreds = (difference - (difference % 100)) / 100;

  return hundreds % 2 == 0;
}

Ship.prototype.draw = function(ctx) {
  if(this.canBeHit() || this.blinkOn()) {
    this.drawShip(ctx);
  }
}

Ship.prototype.collideWith = function(otherObject) {
  if(otherObject.constructor.name == 'Asteroid') {
    otherObject.collideWith(this);
  }
}

module.exports = Ship;

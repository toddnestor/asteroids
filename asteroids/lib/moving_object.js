const Utils = require('./utils');

function MovingObject(options) {
  this.pos = options.pos;// options['pos'] <-- other syntax
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
}

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
  this.pos = this.game.wrap(this.pos)
}

MovingObject.prototype.draw = function(ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();
}

MovingObject.prototype.isCollideWith = function(otherObject) {
  let xSquared = Math.pow(this.pos[0] - otherObject.pos[0], 2)
  let ySquared = Math.pow(this.pos[1] - otherObject.pos[1], 2)
  let distance = Math.sqrt(xSquared + ySquared);

  return distance < (this.radius + otherObject.radius) ? true : false;
}

MovingObject.prototype.collideWith = function(otherObject) {

}

module.exports = MovingObject;

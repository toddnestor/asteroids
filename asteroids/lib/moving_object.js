const Utils = require('./utils');

function MovingObject(options) {
  this.pos = options.pos;// options['pos'] <-- other syntax
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
}

MovingObject.prototype.move = function() {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
}

module.exports = MovingObject;

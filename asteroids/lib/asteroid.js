const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Asteroid(pos) {
  options = { pos: pos, vel: Utils.randomVec(10), color: '#DA4913', radius: 30 }
  MovingObject.call(this, options);
}

Utils.inherits(Asteroid, MovingObject);

module.exports = Asteroid;

const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Asteroid(pos) {
  options = { pos: pos, vel: Utils.randomVec(30), color: '#DA4913', radius: 10 }
  MovingObject.call(this, options);
}

Utils.inherits(Asteroid, MovingObject);


module.exports = Asteroid;

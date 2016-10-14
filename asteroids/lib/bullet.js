const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Bullet() {

}

Utils.inherits(Bullet, MovingObject);

module.exports = Bullet;

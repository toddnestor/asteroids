const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Ship() {

}

Utils.inherits(Ship , MovingObject);

module.exports = Ship;

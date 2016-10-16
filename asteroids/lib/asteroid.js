const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Asteroid(pos, game) {
  options = { pos: pos, vel: Utils.randomVec(5, -5), color: Asteroid.randColor(), radius: Asteroid.randRadius(), game: game }
  MovingObject.call(this, options);
}

Utils.inherits(Asteroid, MovingObject);

Asteroid.randColor = function() {
  let colors = [
    '#16EBEB', '#E516EB', '#D6E72E', '#797771', '#0F20CC', '#8F95CD', '#A136DA', '#180607'
  ];
  let chosen = Math.floor(Math.random()*colors.length);

  return colors[chosen];
}

Asteroid.randRadius = function() {
  return Math.round(Math.random() * 30 ) + 20;
}

Asteroid.prototype.mass = function() {
  return 2 * Math.PI * this.radius;
}

Asteroid.prototype.collideWith = function(otherObject) {
  if(otherObject.constructor.name == 'Ship') {
    if( this.radius < 150 ) {
      this.radius *= 1.1
    }
    otherObject.relocate();
  } else if(otherObject.constructor.name == 'Bullet') {
    otherObject.collideWith(this);
  } else if(otherObject instanceof Asteroid) {

  }
}

module.exports = Asteroid;

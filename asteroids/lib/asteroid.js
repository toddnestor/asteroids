const Utils = require('./utils');
const MovingObject = require('./moving_object');

function Asteroid(game) {
  let pos = this.randomOuterPos(game);
  options = { pos: pos, vel: Utils.randomVec(5, -5), color: Asteroid.randColor(), radius: Asteroid.randRadius(), game: game }
  MovingObject.call(this, options);
  this.el1Angle = Math.random() * 90;
  this.el2Angle = Math.random() * 90 + 180;
}

Utils.inherits(Asteroid, MovingObject);

Asteroid.prototype.randomOuterPos = function(game) {
  let quarterX = game.DIM_X / 4;
  let quarterY = game.DIM_Y / 4;

  let randX = Math.round(Math.random() * quarterX) - (quarterX/2);
  let randY = Math.round(Math.random() * quarterY) - (quarterY/2);

  let x = randX > 0 ? randX : game.DIM_X + randX;
  let y = randY > 0 ? randY : game.DIM_X + randY;

  return [x,y];
}

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
    if( otherObject.canBeHit() ) {
      if( this.radius < 150 ) {
        this.radius *= 1.5
      }
      otherObject.relocate();
    }
  } else if(otherObject.constructor.name == 'Bullet') {
    otherObject.collideWith(this);
  } else if(otherObject instanceof Asteroid) {

  }
}

Asteroid.prototype.draw = function(ctx) {
  ctx.fillStyle = '#000000';
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
  ctx.fillStyle = '#d3d1e7';
  ctx.beginPath();

  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius - 3,
    0,
    2 * Math.PI,
    false
  );

  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  let el1Center = [this.pos[0] + this.radius/4, this.pos[1] - this.radius/2];
  el1Center = this.rotate(el1Center, this.el1Angle);
  ctx.ellipse(
    ...el1Center,
    this.radius/5,
    this.radius/6,
    Utils.radians(45),
    Utils.radians(30),
    Utils.radians(20)
  );
  ctx.stroke();
  ctx.beginPath();
  let el2Center = [this.pos[0] + this.radius/4, this.pos[1] - this.radius/2];
  el2Center = this.rotate(el2Center, this.el2Angle);

  ctx.ellipse(
    ...el2Center,
    this.radius/5,
    this.radius/6,
    Utils.radians(45),
    Utils.radians(30),
    Utils.radians(20)
  );
  ctx.stroke();
}


module.exports = Asteroid;

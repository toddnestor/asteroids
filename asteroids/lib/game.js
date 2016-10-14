const Utils = require('./utils');
const Ship = require('./ship');
const Bullet = require('./bullet');
const Asteroid = require('./asteroid');

function Game() {
  this.addAsteroids();
  this.bullets = [];
  this.ship = new Ship(Utils.randomVec(800), this);

  this.img = new Image();
  this.img.src = './lib/background.jpg';

}

Game.prototype.DIM_X = 1440;
Game.prototype.DIM_Y = 800;
Game.prototype.NUM_ASTEROIDS = 4;

Game.prototype.addAsteroids = function() {
  this.asteroids = [];

  for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
    let pos = Utils.randomVec(this.DIM_Y);
    let asteroid = new Asteroid(pos, this);
    this.add(asteroid);
  }
}

Game.prototype.allObjects = function() {
  return this.asteroids.concat([this.ship]).concat(this.bullets);
}

Game.prototype.draw = function(ctx) {


  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  ctx.drawImage(this.img, 0, 0);
  this.allObjects().forEach(asteroid => {
    asteroid.draw(ctx);
  });
}

Game.prototype.moveObjects = function() {
  this.allObjects().forEach(asteroid => asteroid.move());
}

Game.prototype.wrap = function(pos) {
  if (pos[0] > this.DIM_X) {
    pos[0] = 0;
  } else if (pos[0] < 0 ) {
    pos[0] = this.DIM_X;
  }

  if (pos[1] > this.DIM_Y) {
    pos[1] = 0;
  } else if (pos[1] < 0 ) {
    pos[1] = this.DIM_Y;
  }

  return pos;

}

Game.prototype.isOutOfBounds = function(pos) {
  if( pos[0] > this.DIM_X || pos[0] < 0 || pos[1] > this.DIM_Y || pos[1] < 0 ) {
    return true;
  } else {
    return false;
  }
}

Game.prototype.checkCollisions = function() {
  for(let i = 0; i < this.allObjects().length; i++ ) {
    for(let j = 0; j < this.allObjects().length; j++ ) {
      if(i !== j) {
        if(this.allObjects()[i].isCollideWith(this.allObjects()[j])) {
          this.allObjects()[i].collideWith(this.allObjects()[j]);
        }
      }
    }
  }
}

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
}

Game.prototype.add = function(object) {
  if( object instanceof Bullet ) {
    this.bullets.push(object);
  } else if( object instanceof Asteroid ) {
    this.asteroids.push(object);
  }
}

Game.prototype.remove = function(object) {
  if( object instanceof Asteroid ) {
    let idx = this.asteroids.indexOf( object );
    this.asteroids = this.asteroids.slice(0,idx).concat(this.asteroids.slice(idx+1));
  } else if(object instanceof Bullet) {
    let idx = this.bullets.indexOf( object );
    this.bullets = this.bullets.slice(0,idx).concat(this.bullets.slice(idx+1));
  }
}

module.exports = Game;

const Utils = require('./utils');
const Ship = require('./ship');
const Bullet = require('./bullet');
const Asteroid = require('./asteroid');

function Game() {
  this.addAsteroids();
}

Game.prototype.DIM_X = 1440;
Game.prototype.DIM_Y = 800;
Game.prototype.NUM_ASTEROIDS = 20;

Game.prototype.addAsteroids = function() {
  this.asteroids = [];

  for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
    let pos = Utils.randomVec(this.DIM_Y);
    let asteroid = new Asteroid(pos);
    this.asteroids.push(asteroid);
  }
}

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.asteroids.forEach(asteroid => {
    asteroid.draw(ctx);
  });
}

Game.prototype.moveObjects = function() {
  this.asteroids.forEach(asteroid => asteroid.move());
}

module.exports = Game;

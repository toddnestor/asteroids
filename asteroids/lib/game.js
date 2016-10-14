const Utils = require('./utils');
const Ship = require('./ship');
const Bullet = require('./bullet');
const Asteroid = require('./asteroid');

function Game() {

}

Game.prototype.DIM_X = 1000;
Game.prototype.DIM_Y = 800;
Game.prototype.NUM_ASTEROIDS = 20;

Game.prototype.addAsteroids = function() {
  this.asteroids = [];

  for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
    let pos = Utils.randomVec(800);
    this.asteroids.push(new Asteroid(pos));
  }
}

module.exports = Game;

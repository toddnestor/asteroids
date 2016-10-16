const Game = require('./game');
const Ship = require('./ship');
const Utils = require('./utils');
const Asteroid = require('./asteroid');

function GameView(ctx, width, height, gameOverCallback = function(){}) {
  this.ctx = ctx ;
  Game.prototype.DIM_X = width;
  Game.prototype.DIM_Y = height;
  this.game = new Game();
  this.gameOverCallback = gameOverCallback;
}

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  let that = this;

  setInterval(function(){
    if( that.game.asteroids.length < (that.game.NUM_ASTEROIDS) ) {
      if(that.game.asteroids.length < 1 || Math.round(Math.random() * 10) > 4) {
        let new_asteroid_count = Math.round(Math.random() * 5) + 1;

        for(let i = 0; i < new_asteroid_count; i++ ) {
          let asteroid = new Asteroid(that.game);
          that.game.add(asteroid);
        }
      }
    }
  }, 5000);

  window.requestAnimationFrame(function step(){
    that.game.step();
    that.game.draw(that.ctx);
    that.game.ship.showStats(that.ctx);
    if(that.game.ship.lives_remaining > 0) {
      window.requestAnimationFrame(step);
    } else {
      that.game.gameOver(that.ctx);
      that.game.ship.showStats(that.ctx);
      that.gameOverCallback(that.game.ship.score, that.game.ship.asteroids_destroyed);
    }
  });
}

GameView.prototype.processKey = function(keyCode) {
  // 32 = space
  // 37 = left
  // 38 = up
  // 39 = right
  // 40 = down
  // 88 = x
  switch(keyCode) {
    case 32:
      this.game.ship.fireBullet();
    break;
    case 37:
      this.game.ship.changeDirection(6);
    break;
    case 38:
      this.game.ship.changePower(3);
    break;
    case 39:
      this.game.ship.changeDirection(-6);
    break;
    case 40:
      this.game.ship.changePower(-3);
    break;
    case 88:
      this.game.ship.reset();
    break;
  }
}

GameView.prototype.processKeys = function() {
  key.getPressedKeyCodes().forEach(keyCode => this.processKey(keyCode));
}

GameView.prototype.bindKeyHandlers = function() {
  key('up, left, right, down, space, x', () => this.processKeys() );
}

module.exports = GameView;

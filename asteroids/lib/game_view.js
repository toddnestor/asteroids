const Game = require('./game');
const Ship = require('./ship');
const Utils = require('./utils');
const Asteroid = require('./asteroid');

function GameView(ctx) {
  this.ctx = ctx ;
  this.game = new Game();
}

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  let that = this;

  setInterval(function(){
    if( that.game.asteroids.length < (that.game.NUM_ASTEROIDS) ) {
      if(Math.round(Math.random() * 10) > 6) {
        let new_asteroid_count = Math.round(Math.random() * 5) + 1;

        for(let i = 0; i < new_asteroid_count; i++ ) {
          let pos = Utils.randomVec(that.game.DIM_Y);
          let asteroid = new Asteroid(pos, that.game);
          that.game.add(asteroid);
        }
      }
    }
  }, 5000);

  window.requestAnimationFrame(function step(){
    that.game.step();
    that.game.draw(that.ctx);
    that.game.ship.showStats();
    if(that.game.ship.lives_remaining > 0) {
      window.requestAnimationFrame(step);
    } else {
      that.game.gameOver(that.ctx);
    }
  });
}

GameView.prototype.bindKeyHandlers = function() {
  let that = this;
  key('up', function() {
    that.game.ship.changePower(1);
  });

  key('left', function() {
    that.game.ship.changeDirection(3);
  });

  key('right', function() {
    that.game.ship.changeDirection(-3);
  });

  key('down', function() {
    that.game.ship.changePower(-1);
  });

  key('space', function() {
    that.game.ship.fireBullet();
  });

  key('x', function() {
    that.game.ship.reset();
  })
}

module.exports = GameView;

const Game = require('./game');
const Ship = require('./ship');
const Util = require('./utils');

function GameView(ctx) {
  this.ctx = ctx ;
  this.game = new Game();
}

GameView.prototype.start = function() {
  this.bindKeyHandlers();
  let that = this;

  window.requestAnimationFrame(function step(){
    that.game.step();
    that.game.draw(that.ctx);
    window.requestAnimationFrame(step);
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

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
  setInterval( function() {
    that.game.step();
    that.game.draw(that.ctx);
  }, 20);

}

GameView.prototype.bindKeyHandlers = function() {
  let that = this;
  key('up', function() {
    that.game.ship.power([0,-1]);
  });

  key('left', function() {
    that.game.ship.power([-1,0]);
  });

  key('right', function() {
    that.game.ship.power([1,0]);
  });

  key('down', function() {
    that.game.ship.power([0,1]);
  });

  key('space', function() {
    that.game.ship.fireBullet();
  });
}

module.exports = GameView;

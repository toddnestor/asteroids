const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function(){
  let ctx = document.getElementById('game-canvas').getContext('2d');
  let gameview = new GameView(ctx) ;

  gameview.start();
});

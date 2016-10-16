const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function(){
  let ctx = document.getElementById('game-canvas').getContext('2d');
  let width = Math.min(document.documentElement.clientWidth, window.innerWidth);
  let height = Math.min(document.documentElement.clientHeight, window.innerHeight);
  document.getElementById('game-canvas').width = width;
  document.getElementById('game-canvas').height = height;
  let gameview = new GameView(ctx, width, height);

  gameview.start();
});

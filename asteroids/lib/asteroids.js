const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', function(){
  $.herc.configure({
      api_key: '89a3e25de96b124db26e353574c5ae9507a52af703a0a435aecdbb7b7c57'
  });

  function getHighScores(callback) {
    $.herc.Objects().getAll(
      {type: 'high-score'},
      function(scores) {
        scores = scores.sort((a,b) => {
          return parseInt(b.meta_data.score) > parseInt(a.meta_data.score) ? 1 : -1;
        });

        callback(scores);
      }
    );
  }

  function saveHighScore(score, asteroids, name, callback) {
    data = {
      type: 'high-score',
      name: name,
      field_score: score,
      field_asteroids: asteroids
    }

    $.herc.Objects().post(data, callback);
  }

  let ctx = document.getElementById('game-canvas').getContext('2d');
  let width = Math.min(document.documentElement.clientWidth, window.innerWidth);
  let height = Math.min(document.documentElement.clientHeight, window.innerHeight);
  document.getElementById('game-canvas').width = width;
  document.getElementById('game-canvas').height = height;

  function startGame() {
    let gameview = new GameView(ctx, width, height, function(score, asteroids){
      getHighScores(function(scores){
        $('#scores').html('');

        $(scores).each(function(){
          $('#scores').append($('<li>').append(`<strong>${this.name}</strong> - <strong>Score:</strong> ${this.meta_data.score}  <strong>Asteroids Destroyed:</strong>  ${this.meta_data.asteroids}`));
        });

        $('#score').html(score);
        $('#asteroids').html(asteroids);
        $('.score-form').show();
        $('#high-scores-modal').modal();
        $('.save-score').click(function(e){
          e.preventDefault();
          saveHighScore(score, asteroids, $('#name').val(), function(response){
            $('#name').val('');
            $('.score-form').hide();
            $('.new-game').show();
          });
        });
      });
    });

    gameview.start();
  }

  startGame();

  $('body').on('click', '.new-game', function(e){
    e.preventDefault();
    $('.new-game').hide();
    $('#high-scores-modal').modal('hide')
    startGame();
  });
});

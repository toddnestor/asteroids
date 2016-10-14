/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	document.addEventListener('DOMContentLoaded', function(){
	  let ctx = document.getElementById('game-canvas').getContext('2d');
	  let gameview = new GameView(ctx) ;

	  gameview.start();

	  

	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const Ship = __webpack_require__(4);
	const Util = __webpack_require__(3);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Ship = __webpack_require__(4);
	const Bullet = __webpack_require__(6);
	const Asteroid = __webpack_require__(7);

	function Game() {
	  this.addAsteroids();
	  this.bullets = [];
	  this.ship = new Ship(Utils.randomVec(800), this);
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Utils = {
	  inherits: function (childClass, parentClass) {
	      function Surrogate() {}
	      Surrogate.prototype = parentClass.prototype;
	      childClass.prototype = new Surrogate();
	      childClass.prototype.constructor = childClass;
	  },

	  randomVec: function(length) {
	    let x = Math.floor(Math.random()*length)+1;
	    let y = Math.floor(Math.random()*length)+1;
	    return [x, y];
	  }
	}

	module.exports = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Bullet = __webpack_require__(6);
	const MovingObject = __webpack_require__(5);

	function Ship(pos, game) {
	  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 20, game: game }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Ship , MovingObject);

	Ship.prototype.relocate = function() {
	  this.pos = Utils.randomVec(800);
	  this.vel = [0,0];
	}

	Ship.prototype.power = function(impulse) {
	  this.vel[0] += impulse[0];
	  this.vel[1] += impulse[1];
	}

	Ship.prototype.fireBullet = function() {
	  bullet = new Bullet(this.game)
	  this.game.add(bullet);
	}

	module.exports = Ship;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);

	function MovingObject(options) {
	  this.pos = options.pos;// options['pos'] <-- other syntax
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	  this.game = options.game;
	}

	MovingObject.prototype.isWrappable = true;

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
	  if(this.isWrappable) {
	    this.pos = this.game.wrap(this.pos)
	  } else {
	    if( this.game.isOutOfBounds(this.pos) ) {
	      this.game.remove(this);
	    }
	  }
	}

	MovingObject.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  ctx.arc(
	    this.pos[0],
	    this.pos[1],
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );

	  ctx.fill();
	}

	MovingObject.prototype.isCollideWith = function(otherObject) {
	  let xSquared = Math.pow(this.pos[0] - otherObject.pos[0], 2)
	  let ySquared = Math.pow(this.pos[1] - otherObject.pos[1], 2)
	  let distance = Math.sqrt(xSquared + ySquared);

	  return distance < (this.radius + otherObject.radius) ? true : false;
	}

	MovingObject.prototype.collideWith = function(otherObject) {

	}

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Asteroid = __webpack_require__(7);
	const MovingObject = __webpack_require__(5);

	function Bullet(game) {
	  options = { pos: game.ship.pos.slice(0), vel: Bullet.getVelocity(game), color: '#00FF00', radius: 5, game: game }
	    MovingObject.call(this, options);
	}

	Utils.inherits(Bullet, MovingObject);

	Bullet.prototype.isWrappable = false;

	Bullet.getVelocity = function(game) {
	  let ship_vel = game.ship.vel.slice(0);
	  return ship_vel.map( n => {
	    if( n == 0 ) {
	      return 3;
	    } else {
	      return n*5
	    }
	  })
	}

	Bullet.prototype.collideWith = function(otherObject) {
	  console.log('we collided', otherObject);
	  if(otherObject instanceof Asteroid) {
	    console.log('should be removing');
	    this.game.remove(otherObject);
	  }
	}

	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

	function Asteroid(pos, game) {
	  options = { pos: pos, vel: Utils.randomVec(10), color: Asteroid.randColor(), radius: 30, game: game }
	  MovingObject.call(this, options);
	}



	Utils.inherits(Asteroid, MovingObject);

	Asteroid.randColor = function() {
	  let colors = [
	    '#16EBEB', '#E516EB', '#D6E72E', '#797771', '#0F20CC', '#8F95CD', '#A136DA', '#180607'
	  ];
	  let chosen = Math.floor(Math.random()*colors.length);

	  return colors[chosen];
	}

	Asteroid.prototype.collideWith = function(otherObject) {
	  if(otherObject.constructor.name == 'Ship') {
	    if( this.radius < 150 ) {
	      this.radius *= 1.1
	    }
	    otherObject.relocate();
	  }
	}

	module.exports = Asteroid;


/***/ }
/******/ ]);
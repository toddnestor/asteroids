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
	  let that = this;
	  setInterval( function() {
	    that.game.moveObjects();
	    that.game.draw(that.ctx);
	  }, 20);

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
	const MovingObject = __webpack_require__(5);

	function Ship() {

	}

	Utils.inherits(Ship , MovingObject);

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
	}

	MovingObject.prototype.move = function() {
	  this.pos[0] += this.vel[0];
	  this.pos[1] += this.vel[1];
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

	module.exports = MovingObject;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

	function Bullet() {

	}

	Utils.inherits(Bullet, MovingObject);

	module.exports = Bullet;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const MovingObject = __webpack_require__(5);

	function Asteroid(pos) {
	  options = { pos: pos, vel: Utils.randomVec(10), color: '#DA4913', radius: 30 }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);

	module.exports = Asteroid;


/***/ }
/******/ ]);
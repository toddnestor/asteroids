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

	const Game = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const Ship = __webpack_require__(2);
	const Bullet = __webpack_require__(5);
	const Asteroid = __webpack_require__(6);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);

	function Ship() {

	}

	Utils.inherits(Ship , MovingObject);

	module.exports = Ship;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);

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

	module.exports = MovingObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const Utils = {
	  inherits: function (childClass, parentClass) {
	      function Surrogate() {}
	      Surrogate.prototype = parentClass.prototype;
	      childClass.prototype = new Surrogate();
	      childClass.prototype.constructor = childClass;
	  },

	  randomVec: function(length) {
	    let x = Math.floor(Math.random()*length);
	    let y = Math.floor(Math.random()*length);
	    return [x, y];
	  }
	}

	module.exports = Utils;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);

	function Bullet() {

	}

	Utils.inherits(Bullet, MovingObject);

	module.exports = Bullet;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(4);
	const MovingObject = __webpack_require__(3);

	function Asteroid(pos) {
	  options = { pos: pos, vel: Utils.randomVec(30), color: '#DA4913', radius: 10 }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);


	module.exports = Asteroid;


/***/ }
/******/ ]);
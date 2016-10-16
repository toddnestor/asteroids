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
	const Utils = __webpack_require__(3);
	const Asteroid = __webpack_require__(6);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Ship = __webpack_require__(4);
	const Bullet = __webpack_require__(5);
	const Asteroid = __webpack_require__(6);

	function Game() {
	  this.addAsteroids();
	  this.bullets = [];
	  this.ship = new Ship(Utils.randomVec(800), this);

	  this.img = new Image();
	  this.img.src = './lib/background.jpg';

	}

	Game.prototype.DIM_X = 1440;
	Game.prototype.DIM_Y = 800;
	Game.prototype.NUM_ASTEROIDS = 7;

	Game.prototype.addAsteroids = function() {
	  this.asteroids = [];

	  for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
	    let pos = Utils.randomVec(this.DIM_Y);
	    let asteroid = new Asteroid(pos, this);
	    this.add(asteroid);
	  }
	}

	Game.prototype.allObjects = function() {
	  return this.asteroids.concat(this.bullets).concat([this.ship]);
	}

	Game.prototype.draw = function(ctx) {
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  ctx.drawImage(this.img, 0, 0);
	  this.allObjects().forEach(asteroid => {
	    asteroid.draw(ctx);
	  });
	}

	Game.prototype.gameOver = function(ctx) {
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  ctx.drawImage(this.img, 0, 0);
	  ctx.fillStyle = "white";
	  ctx.font = "bold 40px sans-serif";
	  ctx.fillText("Game over!", this.DIM_X/2 - 100, this.DIM_Y/2 - 20);
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
	      if(i !== j && i < j) {
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
	    this.ship.asteroids_destroyed += 1;
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

	  randomVec: function(length, minimum = 1) {
	    let x = Math.floor(Math.random()*(length - minimum)) + minimum;
	    let y = Math.floor(Math.random()*(length - minimum)) + minimum;

	    return [x, y];
	  },

	  radians: function(angle) {
	    return (Math.PI / 180) * angle;
	  },

	  rotate: function(cx, cy, x, y, angle ) {
	    let radians = this.radians(angle);
	    let cos = Math.cos(radians);
	    let sin = Math.sin(radians);

	    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
	    let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
	    return [nx, ny];
	  },

	  findNewPoint: function(x, y, angle, distance) {
	    let result = [];
	    let radians = this.radians(angle);

	    result.push( Math.round(Math.cos(radians) * distance + x));
	    result.push( Math.round(Math.sin(radians) * distance + y));

	    return result;
	  }
	}

	module.exports = Utils;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Bullet = __webpack_require__(5);
	const MovingObject = __webpack_require__(7);
	let lastBulletFired = null;

	function Ship(pos, game) {
	  options = { pos: pos, vel: [0,0], color: '#E81427', radius: 30, game: game }
	  this.direction = 90;
	  this.lives_remaining = 5;
	  this.asteroids_destroyed = 0;
	  this.bullets_fired = 0;
	  this.power = 0;
	  this.score = 0;
	  MovingObject.call(this, options);
	}

	Utils.inherits(Ship , MovingObject);

	Ship.prototype.MAX_POWER = 15;
	Ship.prototype.MIN_POWER = -Ship.prototype.MAX_POWER;
	Ship.prototype.MIN_TIME_BETWEEN_BULLETS = 100;

	Ship.prototype.showStats = function() {
	  document.getElementById('lives-lost').innerHTML = this.lives_remaining;
	  document.getElementById('asteroids-destroyed').innerHTML = this.asteroids_destroyed;
	  document.getElementById('bullets-fired').innerHTML = this.bullets_fired;
	  document.getElementById('score').innerHTML = this.score;
	}

	Ship.prototype.relocate = function() {
	  this.pos = Utils.randomVec(800);
	  this.direction = 90;
	  this.reset();
	}

	Ship.prototype.reset = function() {
	  this.lives_remaining -= 1;
	  this.vel = [0,0];
	  this.power = 0;
	}

	Ship.prototype.fireBullet = function() {
	  let time = new Date();
	  if( !lastBulletFired || time - lastBulletFired > this.MIN_TIME_BETWEEN_BULLETS) {
	    lastBulletFired = time;
	    let power = this.power * 1.2;
	    if(power < 0) power = 0;
	    this.bullets_fired += 1;

	    let vel = Utils.findNewPoint(0, 0, this.direction, (power + 5));
	    vel = [vel[0], -vel[1]];
	    bullet = new Bullet(vel, this.game)
	    this.game.add(bullet);
	  }
	}

	Ship.prototype.slope = function() {
	  return Math.tan(Utils.radians(this.direction));
	}

	Ship.prototype.newVel = function(x = 0, y = 0) {
	  let vel = Utils.findNewPoint(x, y, this.direction, this.power);

	  return [vel[0], -vel[1]];
	}

	Ship.prototype.changePower = function(amount) {
	  this.power += amount;
	  if( this.power > this.MAX_POWER ) {
	    this.power = this.MAX_POWER;
	  } else if(this.power < this.MIN_POWER ) {
	    this.power = this.MIN_POWER;
	  }
	  this.vel = this.newVel();
	}

	Ship.prototype.changeDirection = function(direction) {
	  this.direction += direction;
	  this.vel = this.newVel();
	}

	Ship.prototype.rotatedPos = function(pos) {
	  return this.rotate(pos, this.direction);
	}

	Ship.prototype.draw = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  let x = this.pos[0];
	  let y = this.pos[1];
	  let r = this.radius;

	  let p1 = this.rotatedPos([x + r, y]);
	  let p2 = this.rotatedPos([x - r, y + r/2]);
	  let p3 = this.rotatedPos([x - r, y - r/2]);

	  ctx.moveTo(...p1);
	  ctx.lineTo(...p2);
	  ctx.lineTo(...p3);

	  ctx.fill();
	}

	Ship.prototype.collideWith = function(otherObject) {
	  if(otherObject.constructor.name == 'Asteroid') {
	    otherObject.collideWith(this);
	  }
	}

	module.exports = Ship;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const Asteroid = __webpack_require__(6);
	const MovingObject = __webpack_require__(7);

	function Bullet(vel, game) {
	  options = { pos: game.ship.pos.slice(0), vel: vel, color: '#00FF00', radius: 5, game: game }
	    MovingObject.call(this, options);
	}

	Utils.inherits(Bullet, MovingObject);

	Bullet.prototype.isWrappable = false;

	Bullet.prototype.collideWith = function(otherObject) {
	  if(otherObject instanceof Asteroid) {
	    this.game.remove(otherObject);
	    this.game.remove(this);
	    this.game.ship.score += Math.round(otherObject.radius);
	  }
	}

	module.exports = Bullet;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Utils = __webpack_require__(3);
	const MovingObject = __webpack_require__(7);

	function Asteroid(pos, game) {
	  options = { pos: pos, vel: Utils.randomVec(5, -5), color: Asteroid.randColor(), radius: Asteroid.randRadius(), game: game }
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

	Asteroid.randRadius = function() {
	  return Math.round(Math.random() * 30 ) + 20;
	}

	Asteroid.prototype.mass = function() {
	  return 2 * Math.PI * this.radius;
	}

	Asteroid.prototype.collideWith = function(otherObject) {
	  if(otherObject.constructor.name == 'Ship') {
	    if( this.radius < 150 ) {
	      this.radius *= 1.1
	    }
	    otherObject.relocate();
	  } else if(otherObject.constructor.name == 'Bullet') {
	    otherObject.collideWith(this);
	  } else if(otherObject instanceof Asteroid) {

	  }
	}

	module.exports = Asteroid;


/***/ },
/* 7 */
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

	MovingObject.prototype.rotate = function(pos, angle) {
	  return Utils.rotate( this.pos[0], this.pos[1], pos[0], pos[1], angle );
	}

	MovingObject.prototype.isCollideWith = function(otherObject) {
	  let xSquared = Math.pow(this.pos[0] - otherObject.pos[0], 2);
	  let ySquared = Math.pow(this.pos[1] - otherObject.pos[1], 2);
	  let distance = Math.sqrt(xSquared + ySquared);

	  return distance < (this.radius + otherObject.radius) ? true : false;
	}

	MovingObject.prototype.collideWith = function(otherObject) {

	}

	module.exports = MovingObject;


/***/ }
/******/ ]);
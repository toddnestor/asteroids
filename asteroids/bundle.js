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
	  let width = Math.min(document.documentElement.clientWidth, window.innerWidth);
	  let height = Math.min(document.documentElement.clientHeight, window.innerHeight);
	  document.getElementById('game-canvas').width = width;
	  document.getElementById('game-canvas').height = height;
	  let gameview = new GameView(ctx, width, height);

	  gameview.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);
	const Ship = __webpack_require__(4);
	const Utils = __webpack_require__(3);
	const Asteroid = __webpack_require__(6);

	function GameView(ctx, width, height, gameOverCallback = function(){}) {
	  this.ctx = ctx ;
	  Game.prototype.DIM_X = width;
	  Game.prototype.DIM_Y = height;
	  this.game = new Game();
	  this.gameOverCallback = gameOverCallback;
	}

	GameView.prototype.start = function() {
	  this.bindKeyHandlers();
	  let that = this;

	  setInterval(function(){
	    if( that.game.asteroids.length < (that.game.NUM_ASTEROIDS) ) {
	      if(that.game.asteroids.length < 1 || Math.round(Math.random() * 10) > 4) {
	        let new_asteroid_count = Math.round(Math.random() * 5) + 1;

	        for(let i = 0; i < new_asteroid_count; i++ ) {
	          let asteroid = new Asteroid(that.game);
	          that.game.add(asteroid);
	        }
	      }
	    }
	  }, 5000);

	  window.requestAnimationFrame(function step(){
	    that.game.step();
	    that.game.draw(that.ctx);
	    that.game.ship.showStats(that.ctx);
	    if(that.game.ship.lives_remaining > 0) {
	      window.requestAnimationFrame(step);
	    } else {
	      that.game.gameOver(that.ctx);
	      that.game.ship.showStats(that.ctx);
	      that.gameOverCallback(that.game.ship.score, that.game.ship.asteroids_destroyed);
	    }
	  });
	}

	GameView.prototype.processKey = function(keyCode) {
	  // 32 = space
	  // 37 = left
	  // 38 = up
	  // 39 = right
	  // 40 = down
	  // 88 = x
	  switch(keyCode) {
	    case 32:
	      this.game.ship.fireBullet();
	    break;
	    case 37:
	      this.game.ship.changeDirection(6);
	    break;
	    case 38:
	      this.game.ship.changePower(3);
	    break;
	    case 39:
	      this.game.ship.changeDirection(-6);
	    break;
	    case 40:
	      this.game.ship.changePower(-3);
	    break;
	    case 88:
	      this.game.ship.reset();
	    break;
	  }
	}

	GameView.prototype.processKeys = function() {
	  key.getPressedKeyCodes().forEach(keyCode => this.processKey(keyCode));
	}

	GameView.prototype.bindKeyHandlers = function() {
	  key('up, left, right, down, space, x', () => this.processKeys() );
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
	  this.ship = new Ship([this.DIM_X / 2, this.DIM_Y / 2], this);

	  this.img = new Image();
	  this.img.src = './lib/background.jpg';

	}

	Game.prototype.NUM_ASTEROIDS = 7;

	Game.prototype.addAsteroids = function() {
	  this.asteroids = [];

	  for(let i = 0; i < this.NUM_ASTEROIDS; i++) {
	    let asteroid = new Asteroid(this);
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
	  options = { pos: pos, vel: [0,0], color: '#42abb1', radius: 30, game: game }
	  this.direction = 90;
	  this.lives_remaining = 10;
	  this.asteroids_destroyed = 0;
	  this.bullets_fired = 0;
	  this.power = 0;
	  this.score = 0;
	  this.lastRelocated = new Date();
	  MovingObject.call(this, options);
	}

	Utils.inherits(Ship , MovingObject);
	Ship.prototype.MAX_POWER = 15;
	Ship.prototype.MIN_POWER = -Ship.prototype.MAX_POWER;
	Ship.prototype.MIN_TIME_BETWEEN_BULLETS = 100;

	Ship.prototype.showStats = function(ctx) {
	  ctx.fillStyle = "white";
	  ctx.font = "bold 20px sans-serif";
	  ctx.fillText(`Lives Remaining: ${this.lives_remaining}   Asteroids Destroyed: ${this.asteroids_destroyed}   Score: ${this.score}`, 15, 25);
	}

	Ship.prototype.relocate = function() {
	  this.lastRelocated = new Date();
	  this.pos = [this.game.DIM_X / 2, this.game.DIM_Y / 2];
	  this.direction = 90;
	  this.reset();
	}

	Ship.prototype.canBeHit = function() {
	  let now = new Date();
	  return now - this.lastRelocated > 1500;
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

	    let vel = Utils.findNewPoint(0, 0, this.direction, 30);
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

	Ship.prototype.drawShip = function(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();

	  let x = this.pos[0];
	  let y = this.pos[1];
	  let r = this.radius;

	  let p1 = [x + r, y];
	  let p2 = [x - r, y + r/4];
	  let p3 = [x - r, y - r/4];

	  let bezConX1 = x + this.radius / 4;
	  let bezConY1 = y + (this.radius / 3 * 2);
	  let bezConX2 = x - this.radius / 3;
	  let bezConY2 = y + (this.radius / 3 * 2);

	  let invBezConX2 = x + this.radius / 4;
	  let invBezConY2 = y - (this.radius / 3 * 2);
	  let invBezConX1 = x - this.radius / 3;
	  let invBezConY1 = y - (this.radius / 3 * 2);

	  p1 = this.rotatedPos(p1);
	  p2 = this.rotatedPos(p2);
	  p3 = this.rotatedPos(p3);

	  let bezCon1 = this.rotatedPos([bezConX1, bezConY1]);
	  let bezCon2 = this.rotatedPos([bezConX2, bezConY2]);
	  let invBezCon1 = this.rotatedPos([invBezConX1, invBezConY1]);
	  let invBezCon2 = this.rotatedPos([invBezConX2, invBezConY2]);

	  ctx.moveTo(...p1);
	  ctx.bezierCurveTo(...bezCon1, ...bezCon2, ...p2);
	  ctx.lineTo(...p3);
	  ctx.bezierCurveTo(...invBezCon1, ...invBezCon2, ...p1);

	  let circleX = x + (this.radius/3);
	  let circleY = y;
	  let circleCenter = this.rotatedPos([circleX, circleY]);

	  ctx.fill();

	  ctx.fillStyle = '#accf57';
	  ctx.beginPath();

	  ctx.arc(
	    circleCenter[0],
	    circleCenter[1],
	    this.radius / 4.5,
	    0,
	    2 * Math.PI,
	    false
	  );

	  ctx.fill();
	  let fin1Start = this.rotatedPos([invBezConX1, invBezConY1 + this.radius / 5]);
	  let fin1Corner = this.rotatedPos([x - this.radius - this.radius/2, y - this.radius/2]);
	  let finBezCon1X = invBezConX1 - this.radius/3;
	  let finBezCon1Y = (invBezConY1 + this.radius / 5) - this.radius/2;
	  let finBezCon1 = this.rotatedPos([finBezCon1X, finBezCon1Y]);
	  let fin2BezCon1 = this.rotatedPos([finBezCon1X - this.radius/2, finBezCon1Y + this.radius/2]);

	  let finBezCon2X = finBezCon1X - this.radius/3;
	  let finBezCon2 = this.rotatedPos([finBezCon2X, finBezCon1Y]);
	  let fin2BezCon2 = this.rotatedPos([finBezCon2X, finBezCon1Y + this.radius/2]);

	  ctx.moveTo(...fin1Start);
	  ctx.bezierCurveTo(...finBezCon1, ...finBezCon2, ...fin1Corner);
	  ctx.bezierCurveTo(...fin2BezCon1, ...fin2BezCon2, ...p3);
	  ctx.fill();

	  let fin2Start = this.rotatedPos([invBezConX1, bezConY1 - this.radius / 5]);
	  let fin2Corner = this.rotatedPos([x - this.radius - this.radius/2, y + this.radius/2]);
	  let fin2Con1Y = (bezConY2 - this.radius / 5) + this.radius/2;
	  let fin2Con1 = this.rotatedPos([finBezCon1X, fin2Con1Y]);
	  let fin2Con2 = this.rotatedPos([finBezCon2X, fin2Con1Y]);

	  let fin2bCon1 = this.rotatedPos([finBezCon1X - this.radius/2, fin2Con1Y - this.radius/2]);
	  let fin2bCon2 = this.rotatedPos([finBezCon2X, fin2Con1Y - this.radius/2]);
	  ctx.moveTo(...fin2Start);
	  ctx.bezierCurveTo(...fin2Con1, ...fin2Con2, ...fin2Corner);
	  ctx.bezierCurveTo(...fin2bCon1, ...fin2bCon2, ...p2);
	  // ctx.lineTo(...p2);
	  ctx.fill();

	  ctx.fillStyle = '#023b4e';
	  ctx.beginPath();
	  ctx.arc(
	    circleCenter[0],
	    circleCenter[1],
	    this.radius / 6,
	    0,
	    2 * Math.PI,
	    false
	  );

	  ctx.fill();
	}

	Ship.prototype.blinkOn = function() {
	  let now = new Date();
	  let difference = now - this.lastRelocated;

	  let hundreds = (difference - (difference % 100)) / 100;

	  return hundreds % 2 == 0;
	}

	Ship.prototype.draw = function(ctx) {
	  if(this.canBeHit() || this.blinkOn()) {
	    this.drawShip(ctx);
	  }
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

	function Asteroid(game) {
	  let pos = this.randomOuterPos(game);
	  options = { pos: pos, vel: Utils.randomVec(5, -5), color: Asteroid.randColor(), radius: Asteroid.randRadius(), game: game }
	  MovingObject.call(this, options);
	}

	Utils.inherits(Asteroid, MovingObject);

	Asteroid.prototype.randomOuterPos = function(game) {
	  let quarterX = game.DIM_X / 4;
	  let quarterY = game.DIM_Y / 4;

	  let randX = Math.round(Math.random() * quarterX) - (quarterX/2);
	  let randY = Math.round(Math.random() * quarterY) - (quarterY/2);

	  let x = randX > 0 ? randX : game.DIM_X + randX;
	  let y = randY > 0 ? randY : game.DIM_X + randY;

	  return [x,y];
	}

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
	    if( otherObject.canBeHit() ) {
	      if( this.radius < 150 ) {
	        this.radius *= 1.5
	      }
	      otherObject.relocate();
	    }
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
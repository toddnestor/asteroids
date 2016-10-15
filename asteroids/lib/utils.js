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
  }
}

module.exports = Utils;

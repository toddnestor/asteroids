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

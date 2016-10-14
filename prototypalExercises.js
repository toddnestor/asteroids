'use strict';

Function.prototype.inherits = function(parent) {
  function Surrogate() {}
  Surrogate.prototype = parent.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = this;
}

function Animal (name) {
  this.name = name;
};


Animal.prototype.eats = function() { console.log(`${this.name} is eating bad developers`); }



function Cat (name) {
  Animal.call(this, name);
}


Cat.inherits(Animal);


let cat = new Cat(`Tom`);

cat.eats() ;

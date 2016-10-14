'use strict';

function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++ ) {
    total += arguments[i];
  }
  return total;
}

function restSum(...numbers) {
  let total = 0;
  numbers.forEach (number => total += number );

  return total;
}
//
// console.log(sum(1917, 1944, 1945, 1991) === 7797)
//
// console.log(restSum(1917, 1944, 1945, 1991)=== 7797)

Function.prototype.myBind = function(context, ...args) {
  return (...args2) => {
    console.log(args.concat(args2))
    this.apply(context, args.concat(args2))
  }

}

class Cat {
  constructor(name) {
    this.name = name;
  }

  says(sound, person) {
    console.log(`${this.name} says ${sound} to ${person}!`);
    return true;
  }
}

// const markov = new Cat("Markov");
// const breakfast = new Cat("Breakfast");
//
// markov.says("meow", "Ned");
// // Markov says meow to Ned!
// // true
//
// markov.says.myBind(breakfast, "meow", "Kush")();
// // Breakfast says meow to Kush!
// // true
//
// markov.says.myBind(breakfast)("meow", "a tree");
// // Breakfast says meow to a tree!
// // true
//
// markov.says.myBind(breakfast, "meow")("Markov");
// // Breakfast says meow to Markov!
// // true
//
// const notMarkovSays = markov.says.myBind(breakfast);
// notMarkovSays("meow", "me");
// // Breakfast says meow to me!
// // true

function curriedSum(numArgs) {
  let numbers = []
  return function _curriedSum(num) {
    numbers.push(num);
    if (numbers.length === numArgs) {
      return sum(...numbers);
    } else {
      return _curriedSum;
    }
  }
}

// console.log(curriedSum(4)(1)(2)(3)(4));

//non-spread curry

Function.prototype.curry = function(numArgs) {
  let args = [];
  let that = this;

  return function _curried(arg) {
    args.push(arg);
    if (args.length === numArgs) {
      return that.apply(null, args);
    } else {
      return _curried;
    }
  }
}




function newSum(...args) {
  return sum(...args);
}

// console.log(newSum.curry(3)(1)(2)(3));

//spread curry

Function.prototype.spreadCurry = function(numArgs) {
  let args = [];
  let that = this;

  return function _curried(arg) {
    args.push(arg);
    if (args.length === numArgs) {
      return that.call(null, ...args);
    } else {
      return _curried;
    }
  }
}

console.log(newSum.spreadCurry(3)(1)(2)(3));













//

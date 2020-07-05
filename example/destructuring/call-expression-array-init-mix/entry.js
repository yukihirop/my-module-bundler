function f() {
  return [1, 2]
};

var [a, b] = f();

/**
 * Error occurr when run the bundled code in a browser.
 * 
 * VM43:55 Uncaught TypeError: Invalid attempt to destructure non-iterable instance.
 * In order to be iterable, non-array objects must have a [Symbol.iterator]() method.
 */

function g() {
  return { c: 1, d: 1 }
};

var [c, d] = g();

function f() {
  return [c, d]
};

var [a, b] = f();

function g() {
  return [a, b]
};

var [c, d] = g();

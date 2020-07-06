function f() {
  return [1, ['2'], [true, null, undefined], [[function () { }, Error, WebAssembly]]]
}

var [a, [b], [...c], [[...d]]] = f()

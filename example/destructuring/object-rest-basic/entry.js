var { a, b, ...x } = { a: 1, b: '2', c: true, d: null, e: undefined, f: function () { }, g: Error, h: WebAssembly };
const { d, e, ...y } = { a: 1, b: '2', c: true, d: null, e: undefined, f: function () { }, g: Error, h: WebAssembly };
let { m, n, ...z } = { a: 1, b: '2', c: true, d: null, e: undefined, f: function () { }, g: Error, h: WebAssembly };

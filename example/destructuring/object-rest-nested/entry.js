var { a, b, c, ...d } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly }
const { e, f, g, ...h } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly }
let { i, j, k, ...l } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly }

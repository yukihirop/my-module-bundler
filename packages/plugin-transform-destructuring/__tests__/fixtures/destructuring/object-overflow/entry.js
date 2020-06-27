var { a, b, c } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly }
const { d, e, f } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly }
let { g, h, i } = { a: 1, b: { b1: '2' }, c: { c1: true, c2: null, c3: undefined }, d: { d1: { d2: function () { } } }, e: Error, f: WebAssembly } 

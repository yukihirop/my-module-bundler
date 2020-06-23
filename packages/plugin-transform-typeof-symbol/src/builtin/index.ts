// MEMO:
// Namespace and Any is divided separately
// The part which typescirpt doesn't recognize was made into a character string.
// There is an object that typescript does not recognize and it is unavoidably using a character string
//
// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects
const builtInGlobalObject = [
  'AggregateError', // typescript unrecognize
  'Array',
  'ArrayBuffer',
  // AsyncFunction, any
  // Atomics, any
  // BigInt, any
  'BigInt64Array',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  'Generator', // typescript unrecognize
  'GeneratorFunction', // typescript unrecognize
  // Infinity, any
  'Int16Array',
  'Int32Array',
  'Int8Array',
  'InternalError', // typescript unrecognize
  // Intl, namespace
  // JSON, any
  'Map',
  // Math, any
  // NaN,
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  // Reflect, namespace
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  // Symbol, any
  'SyntaxError',
  'TypeError',
  'TypedArray', // typescript unrecognize
  'URIError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakSet',
  // WebAssembly, namespace
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'eval',
  // globalThis, any
  'isFinite',
  // isNAN, any
  // null, variable
  'parseFloat',
  'parseInt',
  // undefined, variable
  'unescape',
  // uneval, any
]

const buildInGlobalAny = [
  'AsyncFunction', // typescript unrecognize
  'Atomics',
  'BigInt',
  'Infinity',
  'JSON',
  'Math',
  'NaN',
  'Symbol',
  'globalThis',
  'isNAN', // typescript unrecognize
  'uneval' // typescript unrecognize
]


const builtInGlobalNamespace = [
  'Intl',
  'Reflect',
  'WebAssembly'
]

// Since undefined and null are global objects, I listed them, but I did not use them, so commented out
// const buildInGlobalVariable = [
//   null,
//   undefined
// ]

export default [
  ...builtInGlobalObject,
  ...buildInGlobalAny,
  ...builtInGlobalNamespace
]

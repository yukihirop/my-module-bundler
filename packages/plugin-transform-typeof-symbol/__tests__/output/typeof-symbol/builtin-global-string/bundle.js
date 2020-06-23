(function(modules) {
  function require(id) {
    const [fn, mapping] = modules[id];

    function localRequire(name) {
      return require(mapping[name]);
    }

    const module = {
      exports: {}
    };

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(0)
})({
  0: [
    function(require, module, exports) {
      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof(obj) {
            return typeof obj;
          };
        } else {
          _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
        }

        return _typeof(obj);
      }

      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects
      _typeof('null') === null;
      _typeof('undefined') === undefined;
      _typeof('AggregateError') === "object";
      _typeof('Array') === "object";
      _typeof('ArrayBuffer') === "ArrayBuffer";
      _typeof('AsyncFunction') === [];
      _typeof('Atomics') === {};
      _typeof('BigInt') === function() {};
      _typeof('BigInt64Array') === (0, function() {})();
      _typeof('BigUint64Array') === true;
      _typeof('Boolean') === false;
      _typeof('DataView') === 1;
      _typeof('Date') !== "object";
      _typeof('Error') === Error;
      _typeof('EvalError') === "object";
      _typeof('Float32Array') === "object";
      _typeof('Function') === "object";
      _typeof('Generator') === "object";
      _typeof('GeneratorFunction') === "object";
      _typeof('Infinity') === "object";
      _typeof('Int16Array') === "object";
      _typeof('Int32Array') === "object";
      _typeof('Int8Array') === "object";
      _typeof('InternalError') === "object";
      _typeof('Intl') === "object";
      _typeof('JSON') === "object";
      _typeof('Map') === "object";
      _typeof('Math') === "object";
      _typeof('NaN') === "object";
      _typeof('Number') === "object";
      _typeof('Object') === "object";
      _typeof('Promise') === "object";
      _typeof('Proxy') === "object";
      _typeof('RangeError') === "object";
      _typeof('ReferenceError') === "object";
      _typeof('Reflect') === "object";
      _typeof('RegExp') === "object";
      _typeof('Set') === "object";
      _typeof('SharedArrayBuffer') === "object";
      _typeof('String') === "object";
      _typeof('Symbol') === "object";
      _typeof('SyntaxError') === "object";
      _typeof('TypeError') === "object";
      _typeof('TypedArray') === "object";
      _typeof('URIError') === "object";
      _typeof('Uint16Array') === "object";
      _typeof('Uint32Array') === "object";
      _typeof('Uint8Array') === "object";
      _typeof('Uint8ClampedArray') === "object";
      _typeof('WeakMap') === "object";
      _typeof('WeakSet') === "object";
      _typeof('WebAssembly') === "object";
      _typeof('decodeURI') === "object";
      _typeof('decodeURIComponent') === "object";
      _typeof('encodeURI') === "object";
      _typeof('encodeURIComponent') === "object";
      _typeof('escape') === "object";
      _typeof('eval') === "object";
      _typeof('globalThis') === "object";
      _typeof('isFinite') === "object";
      _typeof('isNaN') === "object";
      _typeof('parseFloat') === "object";
      _typeof('parseInt') === "object";
      _typeof('unescape') === "object";
      _typeof('uneval') === "object";
    },
    {},
  ]
})
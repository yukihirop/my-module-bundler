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
      function _udf_typeof(obj) {
        "babel-udf-helpers - udf_typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _udf_typeof = function(obj) {
            return typeof obj;
          };
        } else {
          _udf_typeof = function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
        }
        return _udf_typeof(obj);
      }

      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects
      _udf_typeof('null') === null;
      _udf_typeof('undefined') === undefined;
      _udf_typeof('AggregateError') === "object";
      _udf_typeof('Array') === "object";
      _udf_typeof('ArrayBuffer') === "ArrayBuffer";
      _udf_typeof('AsyncFunction') === [];
      _udf_typeof('Atomics') === {};
      _udf_typeof('BigInt') === function() {};
      _udf_typeof('BigInt64Array') === (0, function() {})();
      _udf_typeof('BigUint64Array') === true;
      _udf_typeof('Boolean') === false;
      _udf_typeof('DataView') === 1;
      _udf_typeof('Date') !== "object";
      _udf_typeof('Error') === Error;
      _udf_typeof('EvalError') === "object";
      _udf_typeof('Float32Array') === "object";
      _udf_typeof('Function') === "object";
      _udf_typeof('Generator') === "object";
      _udf_typeof('GeneratorFunction') === "object";
      _udf_typeof('Infinity') === "object";
      _udf_typeof('Int16Array') === "object";
      _udf_typeof('Int32Array') === "object";
      _udf_typeof('Int8Array') === "object";
      _udf_typeof('InternalError') === "object";
      _udf_typeof('Intl') === "object";
      _udf_typeof('JSON') === "object";
      _udf_typeof('Map') === "object";
      _udf_typeof('Math') === "object";
      _udf_typeof('NaN') === "object";
      _udf_typeof('Number') === "object";
      _udf_typeof('Object') === "object";
      _udf_typeof('Promise') === "object";
      _udf_typeof('Proxy') === "object";
      _udf_typeof('RangeError') === "object";
      _udf_typeof('ReferenceError') === "object";
      _udf_typeof('Reflect') === "object";
      _udf_typeof('RegExp') === "object";
      _udf_typeof('Set') === "object";
      _udf_typeof('SharedArrayBuffer') === "object";
      _udf_typeof('String') === "object";
      _udf_typeof('Symbol') === "object";
      _udf_typeof('SyntaxError') === "object";
      _udf_typeof('TypeError') === "object";
      _udf_typeof('TypedArray') === "object";
      _udf_typeof('URIError') === "object";
      _udf_typeof('Uint16Array') === "object";
      _udf_typeof('Uint32Array') === "object";
      _udf_typeof('Uint8Array') === "object";
      _udf_typeof('Uint8ClampedArray') === "object";
      _udf_typeof('WeakMap') === "object";
      _udf_typeof('WeakSet') === "object";
      _udf_typeof('WebAssembly') === "object";
      _udf_typeof('decodeURI') === "object";
      _udf_typeof('decodeURIComponent') === "object";
      _udf_typeof('encodeURI') === "object";
      _udf_typeof('encodeURIComponent') === "object";
      _udf_typeof('escape') === "object";
      _udf_typeof('eval') === "object";
      _udf_typeof('globalThis') === "object";
      _udf_typeof('isFinite') === "object";
      _udf_typeof('isNaN') === "object";
      _udf_typeof('parseFloat') === "object";
      _udf_typeof('parseInt') === "object";
      _udf_typeof('unescape') === "object";
      _udf_typeof('uneval') === "object";
    },
    {},
  ]
})
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
      _udf_typeof(null) === null;
      (typeof undefined === "undefined" ? "undefined" : _udf_typeof(undefined)) === undefined;
      (typeof AggregateError === "undefined" ? "undefined" : _udf_typeof(AggregateError)) === "object";
      (typeof Array === "undefined" ? "undefined" : _udf_typeof(Array)) === "object";
      (typeof ArrayBuffer === "undefined" ? "undefined" : _udf_typeof(ArrayBuffer)) === "ArrayBuffer";
      (typeof AsyncFunction === "undefined" ? "undefined" : _udf_typeof(AsyncFunction)) === [];
      (typeof Atomics === "undefined" ? "undefined" : _udf_typeof(Atomics)) === {};
      (typeof BigInt === "undefined" ? "undefined" : _udf_typeof(BigInt)) === function() {};
      (typeof BigInt64Array === "undefined" ? "undefined" : _udf_typeof(BigInt64Array)) === (0, function() {})();
      (typeof BigUint64Array === "undefined" ? "undefined" : _udf_typeof(BigUint64Array)) === true;
      (typeof Boolean === "undefined" ? "undefined" : _udf_typeof(Boolean)) === false;
      (typeof DataView === "undefined" ? "undefined" : _udf_typeof(DataView)) === 1;
      (typeof Date === "undefined" ? "undefined" : _udf_typeof(Date)) !== "object";
      (typeof Error === "undefined" ? "undefined" : _udf_typeof(Error)) === Error;
      (typeof EvalError === "undefined" ? "undefined" : _udf_typeof(EvalError)) === "object";
      (typeof Float32Array === "undefined" ? "undefined" : _udf_typeof(Float32Array)) === "object";
      (typeof Function === "undefined" ? "undefined" : _udf_typeof(Function)) === "object";
      (typeof Generator === "undefined" ? "undefined" : _udf_typeof(Generator)) === "object";
      (typeof GeneratorFunction === "undefined" ? "undefined" : _udf_typeof(GeneratorFunction)) === "object";
      (typeof Infinity === "undefined" ? "undefined" : _udf_typeof(Infinity)) === "object";
      (typeof Int16Array === "undefined" ? "undefined" : _udf_typeof(Int16Array)) === "object";
      (typeof Int32Array === "undefined" ? "undefined" : _udf_typeof(Int32Array)) === "object";
      (typeof Int8Array === "undefined" ? "undefined" : _udf_typeof(Int8Array)) === "object";
      (typeof InternalError === "undefined" ? "undefined" : _udf_typeof(InternalError)) === "object";
      (typeof Intl === "undefined" ? "undefined" : _udf_typeof(Intl)) === "object";
      (typeof JSON === "undefined" ? "undefined" : _udf_typeof(JSON)) === "object";
      (typeof Map === "undefined" ? "undefined" : _udf_typeof(Map)) === "object";
      (typeof Math === "undefined" ? "undefined" : _udf_typeof(Math)) === "object";
      (typeof NaN === "undefined" ? "undefined" : _udf_typeof(NaN)) === "object";
      (typeof Number === "undefined" ? "undefined" : _udf_typeof(Number)) === "object";
      (typeof Object === "undefined" ? "undefined" : _udf_typeof(Object)) === "object";
      (typeof Promise === "undefined" ? "undefined" : _udf_typeof(Promise)) === "object";
      (typeof Proxy === "undefined" ? "undefined" : _udf_typeof(Proxy)) === "object";
      (typeof RangeError === "undefined" ? "undefined" : _udf_typeof(RangeError)) === "object";
      (typeof ReferenceError === "undefined" ? "undefined" : _udf_typeof(ReferenceError)) === "object";
      (typeof Reflect === "undefined" ? "undefined" : _udf_typeof(Reflect)) === "object";
      (typeof RegExp === "undefined" ? "undefined" : _udf_typeof(RegExp)) === "object";
      (typeof Set === "undefined" ? "undefined" : _udf_typeof(Set)) === "object";
      (typeof SharedArrayBuffer === "undefined" ? "undefined" : _udf_typeof(SharedArrayBuffer)) === "object";
      (typeof String === "undefined" ? "undefined" : _udf_typeof(String)) === "object";
      (typeof Symbol === "undefined" ? "undefined" : _udf_typeof(Symbol)) === "object";
      (typeof SyntaxError === "undefined" ? "undefined" : _udf_typeof(SyntaxError)) === "object";
      (typeof TypeError === "undefined" ? "undefined" : _udf_typeof(TypeError)) === "object";
      (typeof TypedArray === "undefined" ? "undefined" : _udf_typeof(TypedArray)) === "object";
      (typeof URIError === "undefined" ? "undefined" : _udf_typeof(URIError)) === "object";
      (typeof Uint16Array === "undefined" ? "undefined" : _udf_typeof(Uint16Array)) === "object";
      (typeof Uint32Array === "undefined" ? "undefined" : _udf_typeof(Uint32Array)) === "object";
      (typeof Uint8Array === "undefined" ? "undefined" : _udf_typeof(Uint8Array)) === "object";
      (typeof Uint8ClampedArray === "undefined" ? "undefined" : _udf_typeof(Uint8ClampedArray)) === "object";
      (typeof WeakMap === "undefined" ? "undefined" : _udf_typeof(WeakMap)) === "object";
      (typeof WeakSet === "undefined" ? "undefined" : _udf_typeof(WeakSet)) === "object";
      (typeof WebAssembly === "undefined" ? "undefined" : _udf_typeof(WebAssembly)) === "object";
      (typeof decodeURI === "undefined" ? "undefined" : _udf_typeof(decodeURI)) === "object";
      (typeof decodeURIComponent === "undefined" ? "undefined" : _udf_typeof(decodeURIComponent)) === "object";
      (typeof encodeURI === "undefined" ? "undefined" : _udf_typeof(encodeURI)) === "object";
      (typeof encodeURIComponent === "undefined" ? "undefined" : _udf_typeof(encodeURIComponent)) === "object";
      (typeof escape === "undefined" ? "undefined" : _udf_typeof(escape)) === "object";
      (typeof eval === "undefined" ? "undefined" : _udf_typeof(eval)) === "object";
      (typeof globalThis === "undefined" ? "undefined" : _udf_typeof(globalThis)) === "object";
      (typeof isFinite === "undefined" ? "undefined" : _udf_typeof(isFinite)) === "object";
      (typeof isNaN === "undefined" ? "undefined" : _udf_typeof(isNaN)) === "object";
      (typeof parseFloat === "undefined" ? "undefined" : _udf_typeof(parseFloat)) === "object";
      (typeof parseInt === "undefined" ? "undefined" : _udf_typeof(parseInt)) === "object";
      (typeof unescape === "undefined" ? "undefined" : _udf_typeof(unescape)) === "object";
      (typeof uneval === "undefined" ? "undefined" : _udf_typeof(uneval)) === "object";
    },
    {},
  ]
})
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
      _typeof(null) === null;
      (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) === undefined;
      (typeof AggregateError === "undefined" ? "undefined" : _typeof(AggregateError)) === "object";
      (typeof Array === "undefined" ? "undefined" : _typeof(Array)) === "object";
      (typeof ArrayBuffer === "undefined" ? "undefined" : _typeof(ArrayBuffer)) === "ArrayBuffer";
      (typeof AsyncFunction === "undefined" ? "undefined" : _typeof(AsyncFunction)) === [];
      (typeof Atomics === "undefined" ? "undefined" : _typeof(Atomics)) === {};
      (typeof BigInt === "undefined" ? "undefined" : _typeof(BigInt)) === function() {};
      (typeof BigInt64Array === "undefined" ? "undefined" : _typeof(BigInt64Array)) === (0, function() {})();
      (typeof BigUint64Array === "undefined" ? "undefined" : _typeof(BigUint64Array)) === true;
      (typeof Boolean === "undefined" ? "undefined" : _typeof(Boolean)) === false;
      (typeof DataView === "undefined" ? "undefined" : _typeof(DataView)) === 1;
      (typeof Date === "undefined" ? "undefined" : _typeof(Date)) !== "object";
      (typeof Error === "undefined" ? "undefined" : _typeof(Error)) === Error;
      (typeof EvalError === "undefined" ? "undefined" : _typeof(EvalError)) === "object";
      (typeof Float32Array === "undefined" ? "undefined" : _typeof(Float32Array)) === "object";
      (typeof Function === "undefined" ? "undefined" : _typeof(Function)) === "object";
      (typeof Generator === "undefined" ? "undefined" : _typeof(Generator)) === "object";
      (typeof GeneratorFunction === "undefined" ? "undefined" : _typeof(GeneratorFunction)) === "object";
      (typeof Infinity === "undefined" ? "undefined" : _typeof(Infinity)) === "object";
      (typeof Int16Array === "undefined" ? "undefined" : _typeof(Int16Array)) === "object";
      (typeof Int32Array === "undefined" ? "undefined" : _typeof(Int32Array)) === "object";
      (typeof Int8Array === "undefined" ? "undefined" : _typeof(Int8Array)) === "object";
      (typeof InternalError === "undefined" ? "undefined" : _typeof(InternalError)) === "object";
      (typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === "object";
      (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === "object";
      (typeof Map === "undefined" ? "undefined" : _typeof(Map)) === "object";
      (typeof Math === "undefined" ? "undefined" : _typeof(Math)) === "object";
      (typeof NaN === "undefined" ? "undefined" : _typeof(NaN)) === "object";
      (typeof Number === "undefined" ? "undefined" : _typeof(Number)) === "object";
      (typeof Object === "undefined" ? "undefined" : _typeof(Object)) === "object";
      (typeof Promise === "undefined" ? "undefined" : _typeof(Promise)) === "object";
      (typeof Proxy === "undefined" ? "undefined" : _typeof(Proxy)) === "object";
      (typeof RangeError === "undefined" ? "undefined" : _typeof(RangeError)) === "object";
      (typeof ReferenceError === "undefined" ? "undefined" : _typeof(ReferenceError)) === "object";
      (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object";
      (typeof RegExp === "undefined" ? "undefined" : _typeof(RegExp)) === "object";
      (typeof Set === "undefined" ? "undefined" : _typeof(Set)) === "object";
      (typeof SharedArrayBuffer === "undefined" ? "undefined" : _typeof(SharedArrayBuffer)) === "object";
      (typeof String === "undefined" ? "undefined" : _typeof(String)) === "object";
      (typeof Symbol === "undefined" ? "undefined" : _typeof(Symbol)) === "object";
      (typeof SyntaxError === "undefined" ? "undefined" : _typeof(SyntaxError)) === "object";
      (typeof TypeError === "undefined" ? "undefined" : _typeof(TypeError)) === "object";
      (typeof TypedArray === "undefined" ? "undefined" : _typeof(TypedArray)) === "object";
      (typeof URIError === "undefined" ? "undefined" : _typeof(URIError)) === "object";
      (typeof Uint16Array === "undefined" ? "undefined" : _typeof(Uint16Array)) === "object";
      (typeof Uint32Array === "undefined" ? "undefined" : _typeof(Uint32Array)) === "object";
      (typeof Uint8Array === "undefined" ? "undefined" : _typeof(Uint8Array)) === "object";
      (typeof Uint8ClampedArray === "undefined" ? "undefined" : _typeof(Uint8ClampedArray)) === "object";
      (typeof WeakMap === "undefined" ? "undefined" : _typeof(WeakMap)) === "object";
      (typeof WeakSet === "undefined" ? "undefined" : _typeof(WeakSet)) === "object";
      (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) === "object";
      (typeof decodeURI === "undefined" ? "undefined" : _typeof(decodeURI)) === "object";
      (typeof decodeURIComponent === "undefined" ? "undefined" : _typeof(decodeURIComponent)) === "object";
      (typeof encodeURI === "undefined" ? "undefined" : _typeof(encodeURI)) === "object";
      (typeof encodeURIComponent === "undefined" ? "undefined" : _typeof(encodeURIComponent)) === "object";
      (typeof escape === "undefined" ? "undefined" : _typeof(escape)) === "object";
      (typeof eval === "undefined" ? "undefined" : _typeof(eval)) === "object";
      (typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) === "object";
      (typeof isFinite === "undefined" ? "undefined" : _typeof(isFinite)) === "object";
      (typeof isNaN === "undefined" ? "undefined" : _typeof(isNaN)) === "object";
      (typeof parseFloat === "undefined" ? "undefined" : _typeof(parseFloat)) === "object";
      (typeof parseInt === "undefined" ? "undefined" : _typeof(parseInt)) === "object";
      (typeof unescape === "undefined" ? "undefined" : _typeof(unescape)) === "object";
      (typeof uneval === "undefined" ? "undefined" : _typeof(uneval)) === "object";
    },
    {},
  ]
})
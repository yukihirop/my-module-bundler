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
      function _typeof2(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof2 = function _typeof2(obj) {
            return typeof obj;
          };
        } else {
          _typeof2 = function _typeof2(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
          };
        }

        return _typeof2(obj);
      }

      (typeof Array === "undefined" ? "undefined" : _typeof2(Array)) === {};

      function _typeof(obj) {}
    },
    {},
  ]
})
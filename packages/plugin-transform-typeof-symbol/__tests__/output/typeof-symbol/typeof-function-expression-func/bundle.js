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

      (typeof Array === "undefined" ? "undefined" : _udf_typeof(Array)) === {};

      var a = function _typeof(obj) {};
    },
    {},
  ]
})
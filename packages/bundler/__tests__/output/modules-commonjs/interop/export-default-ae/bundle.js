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
      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      // ae = array expression
      var a = function() {};

      var b = function() {};

      exports.default = void 0;

      var _default = [a, b];

      exports.default = _default;
    },
    {},
  ]
})
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
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = void 0;

      // ae = array expression
      var a = function() {};

      var b = function() {};

      var _default = [a, b];

      exports.default = _default;
    },
    {},
  ]
})
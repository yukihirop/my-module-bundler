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
      exports.exports = exports.module = exports.require = exports.__filename = exports.__dirname = void 0;

      // Rename for reserved words
      var _exports = function exports() {};

      exports.exports = _exports;

      var _module = function module() {};

      exports.module = _module;

      var _require = function require() {};

      exports.require = _require;

      var _filename = function __filename() {};

      exports.__filename = _filename;

      var _dirname = function __dirname() {};

      exports.__dirname = _dirname;
    },
    {},
  ]
})
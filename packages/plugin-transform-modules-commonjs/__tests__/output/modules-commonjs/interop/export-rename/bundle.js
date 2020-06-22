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
      exports.exports = _exports;
      exports.module = _module;
      exports.require = _require;
      exports.__filename = _filename;
      exports.__dirname = _dirname;

      // Rename for reserved words
      function _exports() {}

      function _module() {}

      function _require() {}

      function _filename() {}

      function _dirname() {}
    },
    {},
  ]
})
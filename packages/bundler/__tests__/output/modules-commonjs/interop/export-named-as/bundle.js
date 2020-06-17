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
      var a;
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.b = void 0;

      exports.b = a;
    },
    {},
  ]
})
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
      exports.default = void 0;

      // ne = new expression
      function A() {
        this.a = "a";
      }

      var _default = new A();

      exports.default = _default;
    },
    {},
  ]
})
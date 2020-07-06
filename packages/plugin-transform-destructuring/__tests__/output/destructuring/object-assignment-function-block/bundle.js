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
      function c() {
        var _a$b = {
            a: 1,
            b: 2
          },
          a = _a$b.a,
          b = _a$b.b;
      }

      ;
    },
    {},
  ]
})
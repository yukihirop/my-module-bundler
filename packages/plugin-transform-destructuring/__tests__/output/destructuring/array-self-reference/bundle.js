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
      var d;
      var _ref = [1, a, b, d],
        a = _ref[0],
        b = _ref[1],
        c = _ref[2];
      var a = 1,
        b = "a",
        c = "b";
    },
    {},
  ]
})
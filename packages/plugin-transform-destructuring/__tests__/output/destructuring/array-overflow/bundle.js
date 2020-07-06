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
      var _ref = [1, '2', true, null, undefined, function() {}, Error, WebAssembly],
        a = _ref[0],
        b = _ref[1],
        c = _ref[2];
      var _ref2 = [1, '2', true, null, undefined, function() {}, Error, WebAssembly],
        d = _ref2[0],
        e = _ref2[1],
        f = _ref2[2];
      var _ref3 = [1, '2', true, null, undefined, function() {}, Error, WebAssembly],
        g = _ref3[0],
        h = _ref3[1],
        i = _ref3[2];
    },
    {},
  ]
})
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
      var a = 1,
        b = '2',
        c = [true, null, undefined, function() {}, Error, WebAssembly];
      const d = 1,
        e = '2',
        f = [true, null, undefined, function() {}, Error, WebAssembly];
      let g = 1,
        h = '2',
        i = [true, null, undefined, function() {}, Error, WebAssembly];
    },
    {},
  ]
})
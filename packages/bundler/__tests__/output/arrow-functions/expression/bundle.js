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
      const arr = [1, 2, 3, 4];
      const result = arr.map(function(x, y) {
        return x * x;
      });
      console.log(result);
    },
    {},
  ]
})
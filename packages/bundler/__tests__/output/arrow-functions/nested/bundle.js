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

      var arr = [
        [1, 2],
        [3, 4]
      ];
      var result = arr.map(function(x, y) {
        var r = x.map(function(u, t) {
          return u * u;
        });
        return r;
      });
      console.log(result);
    },
    {},
  ]
})
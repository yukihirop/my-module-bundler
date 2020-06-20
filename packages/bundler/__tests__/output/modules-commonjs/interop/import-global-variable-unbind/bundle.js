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
      var _a = require("./a.js");

      function d(n) {
        (0, _a.b)(n, 1);
      }

      (0, _a.c)();
      _a.c;
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      function b(n, m) {
        return n * m;
      }

      function c() {}

      exports.b = b;
      exports.c = c;
    },
    {},
  ]
})
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

      var _b = require("./b.js");

      (0, _a.a1)(1, 10);
      (0, _b.b1)(1, 10);
    },
    {
      "./a.js": 1,
      "./b.js": 2
    },
  ],
  1: [
    function(require, module, exports) {
      function a1(n, m) {
        return n * m;
      }

      exports.a1 = a1;
    },
    {},
  ],
  2: [
    function(require, module, exports) {
      function b1(n, m) {
        return n * m;
      }

      exports.b1 = b1;
    },
    {},
  ]
})
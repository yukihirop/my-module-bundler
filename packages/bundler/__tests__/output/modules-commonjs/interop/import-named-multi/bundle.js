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

      var _a = require("./a.js");

      _a.b;
      _a.c;
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      "use strict";

      var b, c;
      exports.b = b;
      exports.c = c;
    },
    {},
  ]
})
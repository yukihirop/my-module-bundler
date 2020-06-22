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

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _a = require("./a.js");

      Object.keys(_a).forEach(function(key) {
        if (key === "default" || key === "__esModule") return;
        Object.defineProperty(exports, key, {
          enumerable: true,
          get: function() {
            return _a[key];
          }
        });
      });
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      "use strict";

      var b, c;
      module.exports = {
        b,
        c
      };
    },
    {},
  ]
})
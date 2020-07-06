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
      Object.defineProperty(exports, "c", {
        enumerable: true,
        get: function() {
          return _a.default;
        }
      });

      function _udf_interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      var _a = _udf_interopRequireDefault(require("./a.js"));
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      "use strict";

      var b;
      module.exports = {
        default: b
      };
    },
    {},
  ]
})
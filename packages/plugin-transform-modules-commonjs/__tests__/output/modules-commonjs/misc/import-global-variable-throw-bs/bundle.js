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

      var _a = _udf_interopRequireDefault(require("./a.js"));

      function _udf_interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      ({
        b
      } = ({
        u: 1,
        t: 2
      }, function() {
        throw new Error('"' + "b" + '" is read-only.');
      }()));
      [b] = ([1, 2], function() {
        throw new Error('"' + "b" + '" is read-only.');
      }());
      b = (1, function() {
        throw new Error('"' + "b" + '" is read-only.');
      }());
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      "use strict";

      var b;
      module.exports = b;
    },
    {},
  ]
})
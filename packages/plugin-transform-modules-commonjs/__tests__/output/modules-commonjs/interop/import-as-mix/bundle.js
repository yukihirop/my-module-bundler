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

      var _a = _udf_interopRequireWildcard(require("./a.js"));

      function _udf_interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
          return {
            default: obj
          };
        }
        var cache = _udf_getRequireWildcardCache();
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }

      function _udf_getRequireWildcardCache() {
        if (typeof WeakMap !== "function") return null;
        var cache = new WeakMap();
        _udf_getRequireWildcardCache = function() {
          return cache;
        };
        return cache;
      }

      _a.default;
      _a.b;
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
      module.exports = c;
    },
    {},
  ]
})
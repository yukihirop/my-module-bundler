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
      exports.hoist = hoist;
      exports.not_hoist_1 = void 0;
      // Function Declaration should be hoisted

      function hoist() {
        return null;
      }

      // Function Expression is not hoisted

      var not_hoist_1 = function not_hoist_1() {
        return null;
      };

      exports.not_hoist_1 = not_hoist_1;
    },
    {},
  ]
})
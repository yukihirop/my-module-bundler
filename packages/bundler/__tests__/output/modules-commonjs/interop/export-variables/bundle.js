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
      exports.i = i;
      exports.a = exports.b = exports.d = exports.e = exports.f = exports.g = exports.h = exports.j = void 0;
      var a = 1;

      exports.a = a;

      var b = 1;

      exports.b = b;

      var d = function() {};

      exports.d = d;

      var e;

      exports.e = e;

      var f = 2;

      exports.f = f;

      var g;

      exports.g = g;

      var h = 3;

      exports.h = h;

      function i() {}

      class j {}

      exports.j = j;
    },
    {},
  ]
})
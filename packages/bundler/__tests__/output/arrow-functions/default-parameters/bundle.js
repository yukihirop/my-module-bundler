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
      var a = function() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return a;
      };

      var b = function(a) {
        var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
        return b;
      };

      var b = function(b) {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return b;
      };
    },
    {},
  ]
})
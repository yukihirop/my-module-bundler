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
      function _objectWithoutProperties(source, excluded) {
        if (source == null) return {};

        var target = _objectWithoutPropertiesLoose(source, excluded);

        var key, i;

        if (Object.getOwnPropertySymbols) {
          var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

          for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyEnumerable.call(source, key)) continue;
            target[key] = source[key];
          }
        }

        return target;
      }

      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null) return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;

        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          target[key] = source[key];
        }

        return target;
      }

      var _a$b$x = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        a = _a$b$x.a,
        b = _a$b$x.b,
        x = _objectWithoutProperties(_a$b$x, ["a", "b"]);

      var _d$e$y = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        d = _d$e$y.d,
        e = _d$e$y.e,
        y = _objectWithoutProperties(_d$e$y, ["d", "e"]);

      var _m$n$z = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        m = _m$n$z.m,
        n = _m$n$z.n,
        z = _objectWithoutProperties(_m$n$z, ["m", "n"]);
    },
    {},
  ]
})
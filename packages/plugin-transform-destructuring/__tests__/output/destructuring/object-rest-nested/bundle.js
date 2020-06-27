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

      var _a$b$c$d$e$f = {
          a: 1,
          b: {
            b1: '2'
          },
          c: {
            c1: true,
            c2: null,
            c3: undefined
          },
          d: {
            d1: {
              d2: function() {}
            }
          },
          e: Error,
          f: WebAssembly
        },
        a = _a$b$c$d$e$f.a,
        b = _a$b$c$d$e$f.b,
        c = _a$b$c$d$e$f.c,
        d = _objectWithoutProperties(_a$b$c$d$e$f, ["a", "b", "c"]);
    },
    {},
  ]
})
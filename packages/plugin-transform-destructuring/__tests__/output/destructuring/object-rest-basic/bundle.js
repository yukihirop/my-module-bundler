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
      function _udf_objectWithoutProperties(source, excluded) {
        if (source == null) return {};
        var target = _udf_objectWithoutPropertiesLoose(source, excluded);
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

      function _udf_objectWithoutPropertiesLoose(source, excluded) {
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

      var _a$b$c$d$e$f$g$h = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        a = _a$b$c$d$e$f$g$h.a,
        b = _a$b$c$d$e$f$g$h.b,
        x = _udf_objectWithoutProperties(_a$b$c$d$e$f$g$h, ["a", "b"]);

      var _a$b$c$d$e$f$g$h2 = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        d = _a$b$c$d$e$f$g$h2.d,
        e = _a$b$c$d$e$f$g$h2.e,
        y = _udf_objectWithoutProperties(_a$b$c$d$e$f$g$h2, ["d", "e"]);

      var _a$b$c$d$e$f$g$h3 = {
          a: 1,
          b: '2',
          c: true,
          d: null,
          e: undefined,
          f: function() {},
          g: Error,
          h: WebAssembly
        },
        m = _a$b$c$d$e$f$g$h3.m,
        n = _a$b$c$d$e$f$g$h3.n,
        z = _udf_objectWithoutProperties(_a$b$c$d$e$f$g$h3, ["m", "n"]);
    },
    {},
  ]
})
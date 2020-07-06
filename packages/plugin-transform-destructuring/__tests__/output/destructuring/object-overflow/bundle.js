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
        c = _a$b$c$d$e$f.c;
      var _a$b$c$d$e$f2 = {
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
        d = _a$b$c$d$e$f2.d,
        e = _a$b$c$d$e$f2.e,
        f = _a$b$c$d$e$f2.f;
      var _a$b$c$d$e$f3 = {
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
        g = _a$b$c$d$e$f3.g,
        h = _a$b$c$d$e$f3.h,
        i = _a$b$c$d$e$f3.i;
    },
    {},
  ]
})
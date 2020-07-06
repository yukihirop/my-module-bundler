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
      var _a$b$c = {
          a: 1,
          b: '2',
          c: true
        },
        a = _a$b$c.a,
        b = _a$b$c.b,
        c = _a$b$c.c;
      var _d$e$f = {
          d: 1,
          e: '2',
          f: true
        },
        d = _d$e$f.d,
        e = _d$e$f.e,
        f = _d$e$f.f;
      var _g$h$i = {
          g: 1,
          h: '2',
          i: true
        },
        g = _g$h$i.g,
        h = _g$h$i.h,
        i = _g$h$i.i;
    },
    {},
  ]
})
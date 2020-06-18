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
      require("./src/a.js");
    },
    {
      "./src/a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      var b;
      exports.b = b;
    },
    {},
  ]
})
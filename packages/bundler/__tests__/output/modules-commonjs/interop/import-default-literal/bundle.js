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
      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _a = _interopRequireDefault(require("./a.js"));

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
          default: obj
        };
      }

      _a.default;
    },
    {
      "./a.js": 1
    },
  ],
  1: [
    function(require, module, exports) {
      var b;
      module.exports = b;
    },
    {},
  ]
})
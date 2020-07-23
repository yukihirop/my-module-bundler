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
      /**
       * VariableDeclaration
       */
      // bodyType: BlockStatement
      var a = function() {}; // bodyType: Identifier


      var b = function(b) {
        return b;
      }; // bodyType: CallExpression


      var c = function(b) {
        console.log(b);
      }; // bodyType: BinaryExpresion


      var d = function(a, b) {
        return a + b;
      };
      /**
       * FunctionDeclaration
       */


      function f() {
        // bodyType: BlockStatement
        var a = function() {}; // bodyType: Identifier


        var b = function(b) {
          return b;
        }; // bodyType: CallExpression


        var c = function(b) {
          console.log(b);
        }; // bodyType: BinaryExpresion


        var d = function(a, b) {
          return a + b;
        };
      }
    },
    {},
  ]
})
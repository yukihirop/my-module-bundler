/**
 * VariableDeclaration
 */

// bodyType: BlockStatement
var a = () => { };
// bodyType: Identifier
var b = (b) => b;
// bodyType: CallExpression
var c = (b) => console.log(b);
// bodyType: BinaryExpresion
var d = (a, b) => a + b;


/**
 * FunctionDeclaration
 */
function f() {
  // bodyType: BlockStatement
  var a = () => { }
  // bodyType: Identifier
  var b = (b) => b;
  // bodyType: CallExpression
  var c = (b) => console.log(b);
  // bodyType: BinaryExpresion
  var d = (a, b) => a + b;
}

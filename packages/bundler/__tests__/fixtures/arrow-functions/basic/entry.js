/**
 * VariableDeclaration
 */

// bodyType: BlockStatement
var a = () => { };
// bodyType: Identifier
var a = (b) => b;
// bodyType: CallExpression
var b = (b) => console.log(b);
// bodyType: BinaryExpresion
var c = (a, b) => a + b;


/**
 * FunctionDeclaration
 */
function a() {
  // bodyType: BlockStatement
  var a = () => { }
  // bodyType: Identifier
  var a = (b) => b;
  // bodyType: CallExpression
  var b = (b) => console.log(b);
  // bodyType: BinaryExpresion
  var c = (a, b) => a + b;
}

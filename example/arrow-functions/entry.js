/**
 * VariableDeclaration
 */

// bodyType: BlockStatement
var a = () => { };
// bodyType: Identifier
var a = (b) => b;
// bodyType: CallExpression
var b = (b) => console.log(b);


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
}

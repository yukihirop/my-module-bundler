import { NodePath } from '@babel/traverse';
import { Statement, CallExpression, BinaryExpression } from '@babel/types';

import * as bt from '@babel/types';

export default (t: typeof bt, path: NodePath, type: string) => {
  let statement, res;

  switch (type) {
    // e.g.) var a = () => {};
    case 'BlockStatement':
      statement = path.node["body"][0] as Statement;
      break;
    // e.g.) var a = (b) => b;
    case 'Identifier':
      statement = t.returnStatement(t.identifier(path.node["body"]["name"]))
      break;
    // e.g.) var b = (b) => console.log(b);
    case 'CallExpression':
      const callee = path.node["body"] as CallExpression
      statement = t.expressionStatement(callee)
      break;
    // e.g.) var c = (a, b) => a + b
    case 'BinaryExpression':
      const binary = path.node["body"] as BinaryExpression
      statement = t.returnStatement(binary)
      break;
    default:
      debugger
      break;
  }

  return statement
}

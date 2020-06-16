import { NodePath } from '@babel/traverse';
import { Statement, CallExpression, BinaryExpression } from '@babel/types';

import * as bt from '@babel/types';

export default (t: typeof bt, path: NodePath, type: string) => {
  let statements;

  switch (type) {
    // e.g.) var a = () => {};
    case 'BlockStatement':
      statements = path.node["body"].body as Statement;
      break;
    // e.g.) var a = (b) => b;
    case 'Identifier':
      statements = [t.returnStatement(t.identifier(path.node["body"]["name"]))]
      break;
    // e.g.) var b = (b) => console.log(b);
    case 'CallExpression':
      const callee = path.node["body"] as CallExpression
      statements = [t.expressionStatement(callee)]
      break;
    // e.g.) var c = (a, b) => a + b
    case 'BinaryExpression':
      const binary = path.node["body"] as BinaryExpression
      statements = [t.returnStatement(binary)]
      break;
    default:
      debugger
      break;
  }

  return statements
}

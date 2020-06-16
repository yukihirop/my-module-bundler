import { NodePath } from '@babel/traverse';
import { Identifier, BlockStatement, CallExpression } from '@babel/types';

import { BabelTypes } from './types'

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-arrow-functions',
    visitor: {
      ArrowFunctionExpression(path: NodePath) {
        if (!path.isArrowFunctionExpression()) return;

        const variableName = path.container["id"].name;
        const id = path.node["id"] ? t.identifier(path.node["id"]) : null;
        const params = path.node["params"] as Array<Identifier>;
        let body = t.blockStatement([]);
        const type = path.node["body"].type

        switch (type) {
          // e.g.) var a = () => {};
          case 'BlockStatement':
            body = path.node["body"] as BlockStatement;
            break;
          // e.g.) var a = (b) => b;
          case 'Identifier':
            const res = t.returnStatement(t.identifier(path.node["body"]["name"]))
            body = t.blockStatement([res])
            break;
          // e.g.) var b = (b) => console.log(b);
          case 'CallExpression':
            const callee = path.node["body"] as CallExpression
            const expression = t.expressionStatement(callee)
            body = t.blockStatement([expression])
            break;
        }

        const replacement = t.variableDeclarator(
          t.identifier(variableName),
          t.functionExpression(id, params, body)
        )

        path.parentPath.replaceWith(replacement);
      },
    },
  };
}

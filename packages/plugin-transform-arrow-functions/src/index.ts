import { NodePath } from '@babel/traverse';
import { Identifier, BlockStatement } from '@babel/types';

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

        if (path.node["body"].type === 'BlockStatement') {
          body = path.node["body"] as BlockStatement;
        } else if (path.node["body"].type === 'Identifier') {
          const res = t.returnStatement(t.identifier(path.node["body"].name))
          body = t.blockStatement([res])
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

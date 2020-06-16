import { NodePath, Node } from '@babel/traverse';
import { Identifier } from '@babel/types';

import { BabelTypes } from './types'
import createStatements from './statement'
import { createBodyParameters } from './helper'

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-arrow-functions',
    visitor: {
      ArrowFunctionExpression(path: NodePath) {
        if (!path.isArrowFunctionExpression()) return;

        const id = path.node["id"] ? t.identifier(path.node["id"]) : null;
        const params = createBodyParameters(path) as Array<Identifier>;
        const type = path.node["body"].type

        const statements = createStatements(t, path, type)
        const body = t.blockStatement(statements)

        let replacement;
        if (Array.isArray(path.container)) {
          // e.g.) arr.map(x=> x * x)
          replacement = t.functionExpression(id, params, body)
          path.replaceWith(replacement);
        } else {
          // e.g.) var a = x => x * x
          const variableName = path.container["id"].name;
          replacement = t.variableDeclarator(
            t.identifier(variableName),
            t.functionExpression(id, params, body)
          )
          path.parentPath.replaceWith(replacement);
        }
      },
    },
  };
}

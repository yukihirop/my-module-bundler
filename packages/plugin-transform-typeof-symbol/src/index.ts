import { NodePath } from '@babel/traverse';

import { BabelTypes } from './types';
import { _interopTypeofStatement, typeofforGlobalObjectStatement, COMPATIBILITY_TYPEOF, LazyEvaluateStatement } from './statement';
import BuiltinGlobalObjects from './builtin'

export default function ({ types: t }: BabelTypes) {
  return {
    name: "transform-typeof-symbol",
    pre(state) {
      this.isTypeof = false
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this)
    },
    post({ path }) {
      this.LazyEvaluateStatement.replaceWith();
      if (this.isTypeof) path.node['body'].unshift(_interopTypeofStatement);
    },
    visitor: {
      UnaryExpression(path: NodePath) {
        const nodeOperator = path.node['operator'];
        if (nodeOperator === 'typeof') {
          this.isTypeof = true

          const argPath = path.get('argument');
          // exclude null and undefined
          const isNull = (argPath as NodePath).isNullLiteral();
          const isUndefined = ((argPath as NodePath).isIdentifier() && path.node['argument'].name === "undefined");
          const isBuiltinGlobalObject = (argPath as NodePath).isIdentifier() && BuiltinGlobalObjects.includes(path.node['argument'].name);
          const isBuiltinGlobal = ![isNull, isUndefined].some(Boolean) && isBuiltinGlobalObject

          let statement;
          if (isBuiltinGlobal) {
            statement = typeofforGlobalObjectStatement(path.node['argument'].name)
          } else {
            statement = t.callExpression(
              t.identifier(COMPATIBILITY_TYPEOF),
              [path.node['argument']]
            )
          }
          this.LazyEvaluateStatement.push({ path, statement })
        }
      }
    }
  }
}

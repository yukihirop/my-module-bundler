import { NodePath } from '@babel/traverse';

import { BabelTypes } from './types';
import { _interopTypeofStatement, typeofforGlobalObjectStatement, COMPATIBILITY_TYPEOF, LazyEvaluateStatement } from './statement';

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
          const arg = path.node['argument'];
          const isBuiltinGlobalObject = this.LazyEvaluateStatement.isBuiltinGlobalObject(arg);

          let statement;
          if (isBuiltinGlobalObject) {
            statement = typeofforGlobalObjectStatement(arg.name)
            this.LazyEvaluateStatement.push({ path, statement })
          } else {
            statement = t.callExpression(
              t.identifier(COMPATIBILITY_TYPEOF),
              [arg]
            )
            path.replaceWith(statement)
          }
        }
      }
    }
  }
}

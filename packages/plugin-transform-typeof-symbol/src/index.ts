import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import { BabelTypes } from './types';
import { _typeofStatement, COMPATIBILITY_TYPEOF } from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "transform-typeof-symbol",
    pre(state) {
      this.beforeStatements = [] as t.Statement[]
    },
    post({ path }) {
      path.node['body'].unshift(...this.beforeStatements);
    },
    visitor: {
      UnaryExpression(path: NodePath) {
        const nodeOperator = path.node['operator'];
        if (nodeOperator === 'typeof') {
          const statement = t.callExpression(
            t.identifier(COMPATIBILITY_TYPEOF),
            [path.node['argument']]
          )
          path.replaceWith(statement)
          this.beforeStatements.push(_typeofStatement)
        }
      }
    }
  }
}

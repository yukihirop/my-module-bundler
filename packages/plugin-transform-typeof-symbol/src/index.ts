import { NodePath } from '@babel/traverse';

import { BabelTypes } from './types';
import { typeofforGlobalObjectStatement, LazyEvaluateStatement } from './statement';
import { useDangerousUDFHelpers } from 'babel-udf-helpers';
import helpers from './helpers';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-typeof-symbol',
    pre(state) {
      useDangerousUDFHelpers(this, { helpers });
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this);
    },
    post({ path }) {
      this.LazyEvaluateStatement.replaceWith();
    },
    visitor: {
      UnaryExpression(path: NodePath) {
        let isUnderHelper = path.findParent((path) => {
          if (path.isFunction()) {
            return (
              // @ts-ignore
              path.get('body.directives.0')?.node.value.value === 'babel-udf-helpers - udf_typeof'
            );
          }
        });

        if (isUnderHelper) return;

        const nodeOperator = path.node['operator'];
        if (nodeOperator === 'typeof') {
          const typeofHelper = this.addUDFHelper('udf_typeof');
          const arg = path.node['argument'];
          const isBuiltinGlobalObject = this.LazyEvaluateStatement.isBuiltinGlobalObject(arg);

          let statement;
          if (isBuiltinGlobalObject) {
            statement = typeofforGlobalObjectStatement(typeofHelper.name, arg.name);
            this.LazyEvaluateStatement.push({ path, statement });
          } else {
            statement = t.callExpression(t.identifier(typeofHelper.name), [arg]);
            path.replaceWith(statement);
          }
        }
      },
    },
  };
}

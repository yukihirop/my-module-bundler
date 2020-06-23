import { NodePath } from '@babel/traverse';

import { BabelTypes } from './types';
import {
  _interopTypeofStatement,
  typeofforGlobalObjectStatement,
  LazyEvaluateStatement,
  COMPATIBILITY_TYPEOF,
} from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-typeof-symbol',
    pre(state) {
      this.isTypeof = false;
      this.typeofFuncName = COMPATIBILITY_TYPEOF;
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this);
    },
    post({ path }) {
      const { typeofFuncName } = this;
      this.LazyEvaluateStatement.replaceWith();
      if (this.isTypeof) path.node['body'].unshift(_interopTypeofStatement(typeofFuncName));
    },
    visitor: {
      Program(path: NodePath) {
        const isExist_TypeofFunc =
          path.node['body'].filter((node) => {
            debugger;
            return (
              (node.type === 'VariableDeclaration' &&
                node.declarations &&
                (node.declarations[0].id.name === COMPATIBILITY_TYPEOF ||
                  node.declarations[0].init.id.name === COMPATIBILITY_TYPEOF)) ||
              (node.type === 'FunctionDeclaration' &&
                node.id &&
                node.id.name === COMPATIBILITY_TYPEOF)
            );
          }).length > 0;
        if (isExist_TypeofFunc) this.typeofFuncName = `${COMPATIBILITY_TYPEOF}2`;
      },
      UnaryExpression(path: NodePath) {
        const { typeofFuncName } = this;
        const nodeOperator = path.node['operator'];
        if (nodeOperator === 'typeof') {
          this.isTypeof = true;
          const arg = path.node['argument'];
          const isBuiltinGlobalObject = this.LazyEvaluateStatement.isBuiltinGlobalObject(arg);

          let statement;
          if (isBuiltinGlobalObject) {
            statement = typeofforGlobalObjectStatement(typeofFuncName, arg.name);
            this.LazyEvaluateStatement.push({ path, statement });
          } else {
            statement = t.callExpression(t.identifier(typeofFuncName), [arg]);
            path.replaceWith(statement);
          }
        }
      },
    },
  };
}

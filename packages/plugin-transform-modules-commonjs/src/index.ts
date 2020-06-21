import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { BabelTypes } from './types';
import { exportVisitor, importVisitor } from './visitor';
import { useStrictStatement, define__esModuleStatement, ExportsVoid0Statement, LazyEvaluateStatement } from './statement';
import { isInStrictMode } from './helper';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    pre(state) {
      this.IsESModule = false;
      this.importedMap = new Map();
      this.beforeStatements = [] as t.Statement[];
      this.willRemovePaths = [] as NodePath[]
      this.ExportsVoid0Statement = new ExportsVoid0Statement();
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this);
    },
    post({ path }) {
      this.LazyEvaluateStatement.replaceWith();
      path.node['body'].unshift(this.ExportsVoid0Statement.build());
      path.node['body'].unshift(...this.beforeStatements);
      if (this.IsESModule) path.node['body'].unshift(define__esModuleStatement);
      if (!isInStrictMode(path)) path.node['body'].unshift(useStrictStatement);
      this.willRemovePaths.forEach((path: NodePath) => path.remove())
    },
    visitor: {
      ...exportVisitor({ types: t }).visitor,
      ...importVisitor({ types: t }).visitor,
      Program: {
        enter(path, state) {
          const { sourceType } = path.node;
          if (sourceType !== 'module' && sourceType !== 'script') {
            throw new Error(`Unknown sourceType "${sourceType}", cannot transform.`)
          }
          // Rename for reserved words
          path.scope.rename('exports');
          path.scope.rename('module');
          path.scope.rename('require');
          path.scope.rename('__filename');
          path.scope.rename('__dirname');
        }
      }
    },
  };
}

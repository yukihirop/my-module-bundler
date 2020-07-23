import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { BabelTypes } from './types';
import { exportVisitor, importVisitor, classVisitor, mainVisitor } from './visitor';
import {
  useStrictStatement,
  define__esModuleStatement,
  loose__esModuleStatement,
  ExportsVoid0Statement,
  LazyEvaluateStatement,
} from './statement';
import { isInStrictMode } from './util';
import { useDangerousUDFHelpers } from 'babel-udf-helpers';
import helpers from './helpers';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    pre(state) {
      useDangerousUDFHelpers(this, { helpers });
      this.IsESModule = false;
      this.importedMap = new Map();
      this.beforeStatements = [] as t.Statement[];
      this.willRemovePaths = [] as NodePath[];
      this.ExportsVoid0Statement = new ExportsVoid0Statement();
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this);
      this.opts = Object.assign(
        {
          loose: false,
          strictMode: true,
        },
        this.opts
      );
    },
    post({ path }) {
      const { loose, strictMode } = this.opts;
      this.LazyEvaluateStatement.replaceWith();
      path.node['body'].unshift(this.ExportsVoid0Statement.build());
      path.node['body'].unshift(...this.beforeStatements);
      if (this.IsESModule) {
        if (loose) {
          path.node['body'].unshift(loose__esModuleStatement);
        } else {
          path.node['body'].unshift(define__esModuleStatement);
        }
      }
      if (!isInStrictMode(path)) {
        if (strictMode) path.node['body'].unshift(useStrictStatement);
      }
      this.willRemovePaths.forEach((path: NodePath) => path.remove());
    },
    visitor: {
      ...exportVisitor({ types: t }).visitor,
      ...importVisitor({ types: t }).visitor,
      ThisExpression(path: NodePath) {
        classVisitor({ types: t }).visitor.ThisExpression(path);
        mainVisitor({ types: t }).visitor.ThisExpression(path);
      },
      Program: {
        enter(path, state) {
          const { sourceType } = path.node;
          if (sourceType !== 'module' && sourceType !== 'script') {
            throw new Error(`Unknown sourceType "${sourceType}", cannot transform.`);
          }
          // Rename for reserved words
          path.scope.rename('exports');
          path.scope.rename('module');
          path.scope.rename('require');
          path.scope.rename('__filename');
          path.scope.rename('__dirname');
        },
      },
    },
  };
}

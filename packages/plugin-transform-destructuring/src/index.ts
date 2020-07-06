import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';
import {
  Dest_ArrayExpressionTraverser,
  Dest_ObjectExpressionTraverser,
  Dest_CallExpressionTraverser
} from './traverser';
import { LazyEvaluateStatement } from './statement';

import { useDangerousUDFHelpers } from 'babel-udf-helpers';
import helpers from './helpers'

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    pre(state) {
      useDangerousUDFHelpers(this, { helpers })
      this.beforeStatements = [] as t.Statement[]
      this.LazyEvaluateStatement = new LazyEvaluateStatement(this);
    },
    post({ path }) {
      const { beforeStatements } = this;
      if (beforeStatements.length > 0) path.node['body'].unshift(...beforeStatements);
      this.LazyEvaluateStatement.replaceWith();
    },
    visitor: {
      CallExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        if (parentPath) {
          const traverser = new Dest_CallExpressionTraverser(parentPath, this)
          const skip = traverser.run()
          if (skip) return
        }
      },
      ObjectExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        if (parentPath) {
          const traverser = new Dest_ObjectExpressionTraverser(parentPath, this)
          const skip = traverser.run()
          if (skip) return
        }
      },
      ArrayExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        if (parentPath) {
          const traverser = new Dest_ArrayExpressionTraverser(parentPath, this)
          const skip = traverser.run()
          if (skip) return
        }
      }
    }
  }
}

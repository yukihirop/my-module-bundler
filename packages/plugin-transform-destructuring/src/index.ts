import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';

import {
  Dest_ArrayExpressionTraverser,
  Dest_ObjectExpressionTraverser,
  Dest_CallExpressionTraverser
} from './traverser';
import { LazyEvaluateStatement } from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    pre(state) {
      this.beforeStatements = [] as t.Statement[]
      this.isAddHelper = false
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
        const traverser = new Dest_ObjectExpressionTraverser(parentPath, this)
        const skip = traverser.run()
        if (skip) return
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

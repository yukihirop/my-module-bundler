import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';

import { ArrayDestructuringTraverser, ObjectDestructuringTraverser } from './traverser';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    pre(state) {
      this.beforeStatements = [] as t.Statement[]
      this.isAddHelper = false
    },
    post({ path }) {
      const { isAddHelper } = this;
      if (isAddHelper) path.node['body'].unshift(...this.beforeStatements)
    },
    visitor: {
      ObjectExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        const traverser = new ObjectDestructuringTraverser(parentPath, this)
        const skip = traverser.run()
        if (skip) return
      },
      ArrayExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        const traverser = new ArrayDestructuringTraverser(parentPath, this)
        const skip = traverser.run()
        if (skip) return
      }
    }
  }
}

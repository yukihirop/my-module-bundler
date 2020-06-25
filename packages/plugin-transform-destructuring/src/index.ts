import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';

import { ArrayDestructuringTraverser } from './traverser';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    visitor: {
      ArrayExpression(path: NodePath) {
        const parentPath = path.findParent(path => path.isVariableDeclaration());
        const traverser = new ArrayDestructuringTraverser(parentPath, this)
        const skip = traverser.run()
        if (skip) return
      }
    }
  }
}

import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';

import { RestElementTraverser } from './traverser';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    visitor: {
      VariableDeclaration(path: NodePath) {
        const traverser = new RestElementTraverser(path, this)
        const skip = traverser.run()
        if (skip) return
      }
    }
  }
}

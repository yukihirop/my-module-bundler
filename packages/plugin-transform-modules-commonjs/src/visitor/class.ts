import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';

import { void0Statement } from '../statement'

export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ThisExpression(path: NodePath) {
        // Convert uncomputed this to void 0
        // e.g.)
        // [this.a](){} => [(void 0).a](){}
        if (!path.container['computed']) {
          const parentType = path.parentPath.parent.type
          if (parentType === 'ClassMethod') {
            path.replaceWith(void0Statement)
          }
        }
      },
    }
  }
}

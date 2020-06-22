import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';

import { void0Statement } from '../statement';

export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ThisExpression(path: NodePath) {
        // Convert uncomputed this to void 0
        // e.g.)
        // Convert from 「this.a = {}」 to 「(void 0).a = {}」
        if (!path.container['computed']) {
          const parentScopeType = path.parentPath.scope.path.node.type;
          if (parentScopeType === 'Program') {
            path.replaceWith(void0Statement);
          }
        }
      },
    },
  };
}

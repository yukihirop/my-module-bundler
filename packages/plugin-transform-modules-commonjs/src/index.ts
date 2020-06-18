import { BabelTypes } from './types';
import { exportVisitor, importVisitor } from './visitor';

import { define__esModuleStatement } from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    pre(state) {
      this.IsESModule = false;
    },
    post({ path }) {
      if (this.IsESModule) {
        path.node['body'].unshift(define__esModuleStatement);
      }
    },
    visitor: {
      ...exportVisitor({ types: t }).visitor,
      ...importVisitor({ types: t }).visitor
    },
  };
}

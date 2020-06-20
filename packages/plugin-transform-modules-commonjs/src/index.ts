import { Statement } from '@babel/types';
import { BabelTypes } from './types';
import { exportVisitor, importVisitor } from './visitor';
import { define__esModuleStatement, ExportsVoid0Statement } from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    pre(state) {
      this.IsESModule = false;
      this.importedMap = new Map();
      this.beforeStatements = [] as Statement[];
      this.ExportsVoid0Statement = new ExportsVoid0Statement();
    },
    post({ path }) {
      if (this.IsESModule) {
        path.node['body'].unshift(this.ExportsVoid0Statement.build());
        path.node['body'].unshift(...this.beforeStatements);
        path.node['body'].unshift(define__esModuleStatement);
      }
    },
    visitor: {
      ...exportVisitor({ types: t }).visitor,
      ...importVisitor({ types: t }).visitor,
    },
  };
}

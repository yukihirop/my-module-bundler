import * as t from '@babel/types';
import { BabelTypes } from './types';
import { exportVisitor, importVisitor } from './visitor';
import { define__esModuleStatement, ExportsVoid0Statement, UnwindingStatement } from './statement';

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    pre(state) {
      this.IsESModule = false;
      this.importedMap = new Map();
      this.beforeStatements = [] as t.Statement[];
      this.ExportsVoid0Statement = new ExportsVoid0Statement();
      this.UnwindingStatement = new UnwindingStatement(this);
    },
    post({ path }) {
      this.UnwindingStatement.buildStatements().forEach((statement: t.Statement) => {
        path.node['body'].push(statement)
      });
      path.node['body'].unshift(this.ExportsVoid0Statement.build());
      path.node['body'].unshift(...this.beforeStatements);
      if (this.IsESModule) path.node['body'].unshift(define__esModuleStatement);
    },
    visitor: {
      ...exportVisitor({ types: t }).visitor,
      ...importVisitor({ types: t }).visitor,
    },
  };
}

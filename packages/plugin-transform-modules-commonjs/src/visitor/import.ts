import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';
import { Statement, ImportDefaultSpecifier, ImportSpecifier } from '@babel/types';

import {
  buildRequireStatement,
  _interopRequireDefault,
} from '../statement';

import { judgeRequireType, INTEROP_REQUIRE_DEFAULT } from '../helper';

import { basename } from 'path';

export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ImportDeclaration(path: NodePath) {
        this.IsESModule = true

        const specifiers = path.node['specifiers'];
        const source = path.node['source'];

        let beforeStatements = [] as Statement[];
        let afterStatements = [] as Statement[];
        let statements = [] as Statement[];

        // e.g.)
        // import b from './a.js';
        if (specifiers.length > 0 && source) {
          const sourceName = source.value;
          const moduleName = basename(sourceName).split('.')[0];
          const requireType = judgeRequireType(specifiers);

          specifiers.forEach((specifier: ImportDefaultSpecifier | ImportSpecifier) => {
            const statement = buildRequireStatement(moduleName, sourceName, requireType);
            statements.push(statement)
            if (requireType === INTEROP_REQUIRE_DEFAULT) afterStatements.push(_interopRequireDefault);
          });
          const mainProgram = t.program(statements)

          path.insertBefore(beforeStatements);
          path.replaceWith(mainProgram);
          path.insertAfter(afterStatements);
        }
      }
    },
  };
}

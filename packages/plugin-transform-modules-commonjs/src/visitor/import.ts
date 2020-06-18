import { NodePath } from '@babel/traverse';
import { BabelTypes } from '../types';
import { Statement, ImportDefaultSpecifier } from '@babel/types';

import {
  buildRequireStatement,
  _interopRequireDefault,
} from '../statement';

import { judgeRequireType, INTEROP_REQUIRE_DEFAULT } from '../helper';

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
          const requireType = judgeRequireType(specifiers);

          specifiers.forEach((specifier: ImportDefaultSpecifier) => {
            const localName = specifier.local ? specifier.local.name : null;

            const statement = buildRequireStatement(localName, sourceName, requireType);
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

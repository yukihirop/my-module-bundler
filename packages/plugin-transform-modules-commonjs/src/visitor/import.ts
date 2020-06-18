import { NodePath, Binding } from '@babel/traverse';
import { BabelTypes } from '../types';
import { Statement } from '@babel/types';

import {
  buildRequireStatement,
  _interopRequireDefault,
  _getRequireWildcardCache,
  _interopRequireWildcard,
} from '../statement';

import { judgeRequireType, createImportedMap, INTEROP_REQUIRE_DEFAULT, INTEROP_REQUIRE_WILDCARD, REQUIRE } from '../helper';
import { basename } from 'path';

const IGNORE_REFERENCED_LIST = ['require', 'module', 'exports']

export default function ({ types: t }: BabelTypes) {
  return {
    // Code that doesn't need to be converted and needed to avoid getting caught in binding
    enter({ scope }) {
      scope.rename('module');
      scope.rename('exports');
      scope.rename('require');
      scope.rename('__dirname');
      scope.rename('__filename');
    },
    visitor: {
      ReferencedIdentifier(path: NodePath) {
        const nodeName = path["node"]["name"];

        if (IGNORE_REFERENCED_LIST.includes(nodeName)) return;

        const localBinding = path.scope.getBinding(nodeName)

        if (!localBinding || localBinding.kind !== 'module') return;

        const idName = localBinding.identifier.name
        const { localName, key } = this.importedMap.get(idName)

        if (key) {
          const statement = t.expressionStatement(
            t.memberExpression(
              t.identifier(localName),
              t.identifier(key),
              false
            )
          )

          path.replaceWith(statement)
        }
      },
      ImportDeclaration(path: NodePath) {
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
          const requireType = judgeRequireType(specifiers, "import");
          let statement, localName;

          switch (requireType) {
            case REQUIRE:
              localName = `_${moduleName}`

              statement = buildRequireStatement(moduleName, sourceName, requireType);
              statements.push(statement)
              break;
            case INTEROP_REQUIRE_DEFAULT:
              this.IsESModule = true
              localName = `_${moduleName}`

              statement = buildRequireStatement(moduleName, sourceName, requireType);
              statements.push(statement)
              afterStatements.push(_interopRequireDefault);
              break;
            case INTEROP_REQUIRE_WILDCARD:
              this.IsESModule = true
              if (specifiers.length > 1) {
                localName = `_${moduleName}`
              } else {
                localName = specifiers.map(s => s["local"] ? s["local"].name : undefined).filter(Boolean)[0]
              }

              statement = buildRequireStatement(localName, sourceName, requireType);
              statements.push(statement)
              afterStatements.push(_getRequireWildcardCache, _interopRequireWildcard);
              break;
          }

          this.importedMap = createImportedMap(localName, specifiers)

          const mainProgram = t.program(statements)
          path.insertBefore(beforeStatements);
          path.replaceWith(mainProgram);
          path.insertAfter(afterStatements);
        }
      }
    },
  };
}

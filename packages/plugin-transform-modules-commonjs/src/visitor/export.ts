import { NodePath } from '@babel/traverse';
import { Expression, ExportSpecifier } from '@babel/types';
import { BabelTypes } from '../types';
import {
  define__esModuleStatement,
  exportsDefaultVoid0Statement,
  exportsDefaultStatement,
  buildDefinePropertyExportsStatement,
  buildDefinePropertyExportNamedStatement,
  buildRequireStatement,
  _interopRequireDefault
} from '../statement'
import {
  functionize,
  judgeRequireType,
  INTEROP_REQUIRE_DEFAULT
} from '../helper'
import { basename } from 'path'



export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ExportAllDeclaration(path: NodePath) {
        const sourceName = path.node["source"].value
        const moduleName = basename(sourceName).split('.')[0]
        const requireStatement = buildRequireStatement(moduleName, sourceName)
        const reExportsStatement = buildDefinePropertyExportsStatement(moduleName)

        path.insertBefore(define__esModuleStatement)
        path.replaceWith(requireStatement)
        path.insertAfter(reExportsStatement)
      },
      ExportNamedDeclaration(path: NodePath) {
        const specifiers = path.node["specifiers"];
        const source = path.node["source"]

        let afterProgram, beforeProgram;
        // e.g.)
        // export default a
        if (specifiers && !source) {
          const moduleName = specifiers[0].local.name
          const beforeStatements = [
            define__esModuleStatement,
            exportsDefaultVoid0Statement,
          ];
          beforeProgram = t.program(beforeStatements);
          afterProgram = t.program([(exportsDefaultStatement(moduleName))])
          path.insertBefore(beforeProgram)
          path.insertAfter(afterProgram)
          // If you do not call it at the end, you will get the following error
          // SyntaxError: unknown: NodePath has been removed so is read-only.
          path.remove()

          // e.g.)
          // export { b, c } from './a.js'
          // export { b as c } from './a.js'
          // export { b as default } from './a.js'
          // export { default as c } from './a.js'
        } else if (specifiers && source) {
          const sourceName = source.value
          const moduleName = basename(sourceName).split('.')[0]

          let requireType = judgeRequireType(specifiers)
          let beforeStatements = [
            define__esModuleStatement,
            ...(specifiers.map((specifier: ExportSpecifier) => {
              const exportedName = specifier.exported.name
              const localName = specifier.local ? specifier.local.name : null
              return buildDefinePropertyExportNamedStatement(moduleName, exportedName, localName)
            }))
          ];
          const requireStatement = buildRequireStatement(moduleName, sourceName, requireType);
          beforeProgram = t.program(beforeStatements);

          path.insertBefore(beforeStatements)
          path.replaceWith(requireStatement)
          if (requireType === INTEROP_REQUIRE_DEFAULT) path.insertAfter(t.program([_interopRequireDefault]))
        }
      },
      ExportDefaultDeclaration(path: NodePath) {
        const declaration = path.node["declaration"]
        const { value: exportValue, type: exportValueType } = declaration
        const idName = declaration.id ? declaration.id.name : "_default";

        let expression, nodeDeclaration;
        switch (exportValueType) {
          case 'ObjectExpression':
            expression = t.objectExpression(declaration.properties)
            break;
          case 'ArrayExpression':
            expression = t.arrayExpression(declaration.elements)
            break;
          case 'FunctionDeclaration':
            nodeDeclaration = t.functionDeclaration(
              t.identifier(idName),
              declaration.params,
              declaration.body
            )
            break;
          case 'CallExpression':
            expression = t.callExpression(
              declaration.callee,
              declaration.arguments
            )
            break;
          case 'NewExpression':
            expression = t.newExpression(
              declaration.callee,
              declaration.arguments
            )
            break;
          case 'Identifier':
            expression = t.identifier(declaration.name)
            break;
          default:
            expression = eval(`t.${functionize(exportValueType)}(${exportValue})`) as Expression
            break;
        }

        const varStatement = t.variableDeclaration("var", [
          t.variableDeclarator(
            t.identifier("_default"),
            expression
          )]
        )

        // e.g.)
        //
        // Object.defineProperty(exports, "__esModule", {
        //   value: true
        // });
        // exports.default = void 0;
        // var _default = <ArrayExpression | ObjectExpression | Literal>;
        // exports.default = _default;
        const beforeStatements = [
          define__esModuleStatement,
          exportsDefaultVoid0Statement,
        ];
        const beforeProgram = t.program(beforeStatements);
        const afterProgram = t.program([(exportsDefaultStatement(idName))])

        let program;
        if (nodeDeclaration) {
          program = t.program([nodeDeclaration]);
        } else {
          program = t.program([varStatement]);
        }

        path.insertBefore(beforeProgram)
        path.replaceWith(program)
        path.insertAfter(afterProgram)
      }
    }
  }
}

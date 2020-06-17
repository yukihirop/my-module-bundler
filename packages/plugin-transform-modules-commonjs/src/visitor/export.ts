import { NodePath } from '@babel/traverse';
import { Expression, ExportSpecifier, Statement } from '@babel/types';
import { BabelTypes } from '../types';
import {
  define__esModuleStatement,
  buildExportsVoid0Statement,
  buildExportsStatement,
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
        // export { a }
        // export { a, b }
        if (specifiers && !source) {
          let beforeStatements = [define__esModuleStatement];
          let afterStatements = [];
          specifiers.forEach((specifier: ExportSpecifier) => {
            const exportedName = specifier.exported.name as string
            const moduleName = specifier.local.name as string

            beforeStatements.push(buildExportsVoid0Statement(exportedName))
            afterStatements.push(buildExportsStatement(exportedName, moduleName))
          })

          beforeProgram = t.program(beforeStatements);
          afterProgram = t.program(afterStatements)
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
          const requireType = judgeRequireType(specifiers)

          let beforeStatements = [define__esModuleStatement];
          let afterStatements = [] as Statement[];
          specifiers.forEach((specifier: ExportSpecifier) => {
            const exportedName = specifier.exported.name
            const localName = specifier.local ? specifier.local.name : null

            beforeStatements.push(buildDefinePropertyExportNamedStatement(moduleName, exportedName, localName))
            if (requireType === INTEROP_REQUIRE_DEFAULT) afterStatements.push(_interopRequireDefault)
          })
          const requireStatement = buildRequireStatement(moduleName, sourceName, requireType);

          path.insertBefore(beforeStatements)
          path.replaceWith(requireStatement)
          path.insertAfter(afterStatements)
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
          buildExportsVoid0Statement(),
        ];
        const afterStatements = [
          buildExportsStatement("default", idName)
        ]
        const beforeProgram = t.program(beforeStatements);
        const afterProgram = t.program(afterStatements);

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

import { NodePath } from '@babel/traverse';
import { Expression, ExportSpecifier, Statement, Declaration } from '@babel/types';
import { BabelTypes } from '../types';
import {
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
        this.IsESModule = true

        const sourceName = path.node["source"].value
        const moduleName = basename(sourceName).split('.')[0]
        const requireStatement = buildRequireStatement(moduleName, sourceName)
        const reExportsStatement = buildDefinePropertyExportsStatement(moduleName)

        path.replaceWith(requireStatement)
        path.insertAfter(reExportsStatement)
      },
      ExportNamedDeclaration(path: NodePath) {
        this.IsESModule = true

        const specifiers = path.node["specifiers"];
        const source = path.node["source"]
        const declaration = path.node["declaration"]

        let afterProgram, beforeProgram;
        let beforeStatements = [] as Statement[];
        let afterStatements = [] as Statement[];

        // e.g.)
        // export { a }
        // export { a, b }
        if (specifiers.length > 0 && !source) {
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
        } else if (specifiers.length > 0 && source) {
          const sourceName = source.value
          const moduleName = basename(sourceName).split('.')[0]
          const requireType = judgeRequireType(specifiers)

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

          // TODO: There is no end if it is implemented separately for each case.
          // e.g.)
          // export var a = 1;
          // export function a() { }
          // export class A() {}
        } else if (declaration) {
          const bodyType = declaration["body"] ? declaration["body"].type : null
          let statements = []

          if (bodyType === 'BlockStatement') {
            const exportedName = declaration["id"].name
            const nodeDeclaration = t.functionDeclaration(
              t.identifier(exportedName),
              declaration.params,
              declaration.body
            )
            statements.push(nodeDeclaration)
            beforeStatements.push(buildExportsVoid0Statement(exportedName))
            afterStatements.push(buildExportsStatement(exportedName, exportedName))
          } else if (bodyType === 'ClassBody') {
            const exportedName = declaration["id"].name
            const nodeDeclaration = t.classDeclaration(
              t.identifier(exportedName),
              null,
              declaration.body,
              null
            )
            statements.push(nodeDeclaration)
            beforeStatements.push(buildExportsVoid0Statement(exportedName))
            afterStatements.push(buildExportsStatement(exportedName, exportedName))
          } else {
            declaration.declarations.forEach((child: Declaration) => {
              const exportedName = child["id"].name
              const statement = t.variableDeclaration("var", [
                t.variableDeclarator(
                  t.identifier(exportedName),
                  child["init"]
                )
              ])

              statements.push(statement)
              beforeStatements.push(buildExportsVoid0Statement(exportedName))
              afterStatements.push(buildExportsStatement(exportedName, exportedName))
            })
          }

          const mainProgram = t.program(statements)
          beforeProgram = t.program(beforeStatements);
          afterProgram = t.program(afterStatements)
          path.insertBefore(beforeProgram)
          path.replaceWith(mainProgram)
          path.insertAfter(afterProgram)
        }
      },
      ExportDefaultDeclaration(path: NodePath) {
        this.IsESModule = true

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
        const beforeStatements = [buildExportsVoid0Statement()];
        const afterStatements = [buildExportsStatement("default", idName)]
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
    },
  }
}

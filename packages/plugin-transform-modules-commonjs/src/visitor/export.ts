import { NodePath } from '@babel/traverse';
import { Expression, ExportSpecifier, Statement } from '@babel/types';
import { BabelTypes, VariableKindType } from '../types';
import {
  buildExportsVoid0Statement,
  buildExportsStatement,
  buildDefinePropertyExportsStatement,
  buildDefinePropertyExportNamedStatement,
  buildRequireStatement,
  _interopRequireDefault,
} from '../statement';
import { functionize, judgeRequireType, INTEROP_REQUIRE_DEFAULT, ES_MODULE } from '../helper';
import { basename } from 'path';

export default function ({ types: t }: BabelTypes) {
  return {
    visitor: {
      ExportAllDeclaration(path: NodePath) {
        this.IsESModule = true;

        const sourceName = path.node['source'].value;
        const moduleName = basename(sourceName).split('.')[0];
        const requireStatement = buildRequireStatement(moduleName, sourceName);
        const reExportsStatement = buildDefinePropertyExportsStatement(moduleName);

        path.replaceWith(requireStatement);
        path.insertAfter(reExportsStatement);
      },
      ExportNamedDeclaration(path: NodePath) {
        this.IsESModule = true;

        const specifiers = path.node['specifiers'];
        const source = path.node['source'];
        const declaration = path.node['declaration'];
        const nodeType = path.node['type'];

        //　use in case3. Preprocessing
        let isFunctionExpression = true;
        let variableKind = 'var' as VariableKindType;
        switch (nodeType) {
          case 'FunctionDeclaration':
            isFunctionExpression = declaration['expression'];
            break;
          case 'VariableDeclaration':
            variableKind = declaration['kind'];
            break;
        }

        let afterProgram;
        let afterStatements = [] as Statement[];

        // CASE 1
        //
        // e.g.)
        // export { a }
        // export { a, b }
        if (specifiers.length > 0 && !source) {
          specifiers.forEach((specifier: ExportSpecifier) => {
            const exportedName = specifier.exported.name as string;
            const moduleName = specifier.local.name as string;

            if (exportedName === ES_MODULE) throw new Error(`Illegal export "${ES_MODULE}"`)

            this.beforeStatements.push(buildExportsVoid0Statement(exportedName));
            afterStatements.push(buildExportsStatement(exportedName, moduleName));
          });

          afterProgram = t.program(afterStatements);
          path.insertAfter(afterProgram);
          // If you do not call it at the end, you will get the following error
          // SyntaxError: unknown: NodePath has been removed so is read-only.
          path.remove();

          // CASE 2
          //
          // e.g.)
          // export { b, c } from './a.js'
          // export { b as c } from './a.js'
          // export { b as default } from './a.js'
          // export { default as c } from './a.js'
        } else if (specifiers.length > 0 && source) {
          const sourceName = source.value;
          const moduleName = basename(sourceName).split('.')[0];
          const requireType = judgeRequireType(specifiers, "export");

          specifiers.forEach((specifier: ExportSpecifier) => {
            const exportedName = specifier.exported.name;
            const localName = specifier.local ? specifier.local.name : null;

            this.beforeStatements.push(
              buildDefinePropertyExportNamedStatement(moduleName, exportedName, localName)
            );
            if (requireType === INTEROP_REQUIRE_DEFAULT)
              afterStatements.push(_interopRequireDefault);
          });
          const requireStatement = buildRequireStatement(moduleName, sourceName, requireType);

          path.replaceWith(requireStatement);
          path.insertAfter(afterStatements);

          // CASE 3
          //
          // TODO: There is no end if it is implemented separately for each case.
          // e.g.)
          // ○: FunctionDeclaration: export function a() {}
          // ○: FunctionExpression:  export var a = function(){};
          // ○: ClassDeclaration:    export class A{}
          // x: ClassExpression?:    export var a = calss A{}
        } else if (declaration) {
          const declarationType = declaration.type
          let statements = [];
          let exportedName = 'default';
          let childDeclaration, statement;

          switch (declarationType) {
            // CASE 3.1
            //
            // e.g.)
            // export function a() {}
            case 'FunctionDeclaration':
              exportedName = declaration['id'].name;
              statement = t.functionDeclaration(
                t.identifier(exportedName),
                declaration.params,
                declaration.body
              )
              statements.push(statement);
              // Function Declaration should be hoisting
              //
              // e.g.)
              //
              // exports.hoist = hoist
              this.beforeStatements.push(buildExportsStatement(exportedName, exportedName));

              break;

            // CASE 3.2
            //
            // e.g.)
            // export var a = function(){}
            case 'VariableDeclaration':
              childDeclaration = declaration.declarations[0]
              exportedName = childDeclaration['id'].name;
              statement = t.variableDeclaration(variableKind, [
                t.variableDeclarator(t.identifier(exportedName), childDeclaration['init']),
              ]);

              statements.push(statement);

              //　Function Expression is not hoisted
              //
              // e.g.)
              //
              // exports.not_hoist = void 0
              //
              // var not_hoist = function(){}
              //
              // exports.not_hoist = not_hoist
              if (isFunctionExpression) {
                this.beforeStatements.push(buildExportsVoid0Statement(exportedName));
                afterStatements.push(buildExportsStatement(exportedName, exportedName));
              }
              break;

            // CASE 3.3
            //
            // e.g.)
            // export class A{}
            case 'ClassDeclaration':
              exportedName = declaration['id'].name;
              const nodeDeclaration = t.classDeclaration(
                t.identifier(exportedName),
                null,
                declaration.body,
                null
              );
              statements.push(nodeDeclaration);
              this.beforeStatements.push(buildExportsVoid0Statement(exportedName));
              afterStatements.push(buildExportsStatement(exportedName, exportedName));
              break;
          }

          const mainProgram = t.program(statements);
          afterProgram = t.program(afterStatements);
          path.replaceWith(mainProgram);
          path.insertAfter(afterProgram);
        }
      },
      ExportDefaultDeclaration(path: NodePath) {
        this.IsESModule = true;

        const declaration = path.node['declaration'];
        const { value: exportValue, type: exportValueType } = declaration;
        const idName = declaration.id ? declaration.id.name : '_default';

        let expression, nodeDeclaration;
        switch (exportValueType) {
          case 'ObjectExpression':
            expression = t.objectExpression(declaration.properties);
            break;
          case 'ArrayExpression':
            expression = t.arrayExpression(declaration.elements);
            break;
          case 'FunctionDeclaration':
            nodeDeclaration = t.functionDeclaration(
              t.identifier(idName),
              declaration.params,
              declaration.body
            );
            break;
          case 'CallExpression':
            expression = t.callExpression(declaration.callee, declaration.arguments);
            break;
          case 'NewExpression':
            expression = t.newExpression(declaration.callee, declaration.arguments);
            break;
          case 'Identifier':
            expression = t.identifier(declaration.name);
            break;
          default:
            expression = eval(`t.${functionize(exportValueType)}(${exportValue})`) as Expression;
            break;
        }

        const varStatement = t.variableDeclaration('var', [
          t.variableDeclarator(t.identifier('_default'), expression),
        ]);

        // e.g.)
        //
        // Object.defineProperty(exports, "__esModule", {
        //   value: true
        // });
        // exports.default = void 0;
        // var _default = <ArrayExpression | ObjectExpression | Literal>;
        // exports.default = _default;
        this.beforeStatements.push(buildExportsVoid0Statement());
        const afterStatements = [buildExportsStatement('default', idName)];
        const afterProgram = t.program(afterStatements);

        let program;
        if (nodeDeclaration) {
          program = t.program([nodeDeclaration]);
        } else {
          program = t.program([varStatement]);
        }

        path.replaceWith(program);
        path.insertAfter(afterProgram);
      },
    },
  };
}

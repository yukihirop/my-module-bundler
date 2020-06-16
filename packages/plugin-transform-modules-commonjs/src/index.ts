import { NodePath } from '@babel/traverse';
import { Expression } from '@babel/types';

import { BabelTypes } from './types';
import {
  define__esModuleStatement,
  exportsDefaultVoid0Statement,
  exportsDefaultStatement
} from './statement'

const functionize = function (str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export default function ({ types: t }: BabelTypes) {
  return {
    name: 'transform-modules-commonjs',
    visitor: {
      ExportDefaultDeclaration(path: NodePath) {
        const declaration = path.node["declaration"]
        const { value: exportValue, type: exportValueType } = declaration

        let expression;
        switch (exportValueType) {
          case 'ObjectExpression':
            expression = t.objectExpression(declaration.properties)
            break;
          case 'ArrayExpression':
            expression = t.arrayExpression(declaration.elements)
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
        const program = t.program([varStatement]);
        const afterProgram = t.program([exportsDefaultStatement])
        path.insertBefore(beforeProgram)
        path.replaceWith(program)
        path.insertAfter(afterProgram)
      }
    }
  }
}

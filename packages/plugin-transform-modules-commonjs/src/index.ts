import { NodePath } from '@babel/traverse';
import { Expression } from '@babel/types';

import { BabelTypes } from './types';
import {
  useStrictStatement,
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
        const exportValueType = path.node["declaration"].type
        const exportValue = path.node["declaration"].value
        const expression = eval(`t.${functionize(exportValueType)}(${exportValue})`) as Expression
        const varStatement = t.variableDeclaration("var", [
          t.variableDeclarator(
            t.identifier("_default"),
            expression
          )]
        )

        // e.g.)
        // 
        // "use strict";
        // 
        // Object.defineProperty(exports, "__esModule", {
        //   value: true
        // });
        // exports.default = void 0;
        // var _default = 1;
        // exports.default = _default;
        const statements = [
          useStrictStatement,
          define__esModuleStatement,
          exportsDefaultVoid0Statement,
          varStatement,
          exportsDefaultStatement
        ];

        const program = t.program(statements);
        path.parentPath.replaceWith(program)
      }
    }
  }
}

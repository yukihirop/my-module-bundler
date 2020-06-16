import { NodePath, Node } from '@babel/traverse';
import * as bt from '@babel/types';

import { hasDefaultParameter } from '../../helper';

const functionize = function (str: string): string {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export default (t: typeof bt, path: NodePath) => {
  const beforeInsertStatements = path.node['params']
    .map((node: Node, index: number) => {
      if (!hasDefaultParameter(node)) return;

      const leftVariableName = node['left'].name;

      // e.g.) arguments.length > 0
      const leftExpression_1 = t.binaryExpression(
        '>',
        t.memberExpression(t.identifier('arguments'), t.identifier('length'), false),
        t.numericLiteral(index)
      );

      // e.g.) arguments[0] !== undefined
      const leftExpression_2 = t.binaryExpression(
        '!==',
        t.memberExpression(t.identifier('arguments'), t.numericLiteral(index), true),
        t.identifier('undefined')
      );

      // e.g.) arguments[0]
      const consequent = t.memberExpression(
        t.identifier('arguments'),
        t.numericLiteral(index),
        true
      );

      const alternateType = node['right'].type;
      const alternateValue = node['right'].value;
      const alternate = eval(`t.${functionize(alternateType)}(${alternateValue})`);

      //  e.g.) var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "30";
      return t.variableDeclaration('var', [
        t.variableDeclarator(
          t.identifier(leftVariableName),
          t.conditionalExpression(
            t.logicalExpression('&&', leftExpression_1, leftExpression_2),
            consequent,
            alternate
          )
        ),
      ]);
    })
    .filter(Boolean);

  return beforeInsertStatements;
};

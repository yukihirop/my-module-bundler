import { NodePath } from '@babel/traverse';
import template from '@babel/template';

import { BabelTypes } from './types';

export default function ({ types: t }: BabelTypes) {
  return {
    name: "plugin-transform-destructuring",
    visitor: {
      VariableDeclaration(path: NodePath) {
        const { node } = path

        const declaration = node['declarations'] && node['declarations'][0];
        if (!declaration) return;

        const idElements = declaration.id && declaration.id.elements;
        if (!idElements) return;

        const idMap = idElements.map((el, index) => {
          if (el.type === 'RestElement') {
            return { name: el.argument.name, isRestElement: true, index }
          } else {
            return { name: el.name, isRestElement: false, index }
          }
        });

        const isExistRestElement = Object.entries(idMap).filter(([isRestElement]) => isRestElement).length > 0;
        if (!isExistRestElement) return;

        const initElements = declaration.init && declaration.init.elements;
        const initValues = initElements.map(el => el.value);

        const variableDeclarators = idMap.map(({ name, isRestElement, index }) => {
          // e.g.)
          // a = 1 or a = [1, '2', true, null, undefined, function () { }, Error, WebAssembly]
          return t.variableDeclarator(
            t.identifier(name),
            isRestElement ? t.arrayExpression(initElements.slice(index).map(node => t.cloneNode(node))) : t.cloneNode(initElements[index])
          )
        })

        const kind = node['kind']
        const statement = t.variableDeclaration(
          kind,
          variableDeclarators
        )

        path.replaceWith(statement)
      }
    }
  }
}

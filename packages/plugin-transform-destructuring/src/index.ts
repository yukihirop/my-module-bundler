import { NodePath } from '@babel/traverse';
import { BabelTypes } from './types';

const searchIdData = (el: any, depth = 0): { name: string, isRestElement: boolean, depth: number } => {
  const elType = el.type
  switch (elType) {
    case 'ArrayPattern':
      depth++
      return searchIdData(el.elements[0], depth)
    case 'Identifier':
      return { name: el.name, isRestElement: false, depth }
    case 'RestElement':
      return { name: el.argument.name, isRestElement: true, depth }
  }
}

const unnested = (arr: Array<any>, count: number): any => {
  return count === 0 ?
    arr
    :
    [...Array(count).keys()].reduce((acc, _) => {
      acc = acc[0]
      return acc
    }, arr);
}

const unnestedForRest = (arr: Array<any>, count: number): any => {
  return count === 0 ?
    arr
    :
    [...Array(count).keys()].reduce((acc, _) => {
      if (acc.length > 0 && acc[0]['type'] === 'ArrayExpression') {
        count--
        acc = acc[0]
        return unnestedForRest(acc['elements'], count)
      } else {
        return acc
      }
    }, arr)
}

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
          return { ...searchIdData(el), index }
        });

        const isExistRestElement = Object.entries(idMap).filter(([isRestElement]) => isRestElement).length > 0;
        if (!isExistRestElement) return;

        const initElements = declaration.init && declaration.init.elements;
        // e.g.)
        // var [a, b, ...c] = [1, '2', true, null, undefined, function () { }, Error, WebAssembly];
        // var [a, [b], [...c], [...d]] = [1, ['2'], [true, null, undefined], [function () { }, Error, WebAssembly]]
        const variableDeclarators = idMap.map(({ name, isRestElement, index, depth }) => {
          if (isRestElement) {
            const sliced = initElements.slice(index)
            let afterSlicedObj = sliced;
            if (sliced[0].type === 'ArrayExpression') afterSlicedObj = unnestedForRest(sliced[0].elements, depth);

            return t.variableDeclarator(
              t.identifier(name),
              Array.isArray(afterSlicedObj) ? t.arrayExpression(afterSlicedObj.map(node => t.cloneNode(node))) : t.cloneNode(afterSlicedObj)
            )
          } else {
            const initEl = initElements[index]
            let unnestedEl = initEl;
            if (initEl.type === 'ArrayExpression') unnestedEl = unnested(initEl.elements, depth);

            return t.variableDeclarator(
              t.identifier(name),
              t.cloneNode(unnestedEl)
            )
          }
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

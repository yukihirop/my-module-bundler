import { NodePath, Node } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../BaseTraverser';
import { TraverserThisType } from '../../types';

type IdDataType = { name: string, isRestElement: boolean, depth: number }

export default class DestructuringTraverser extends BaseTraverser {
  public traverserThis: TraverserThisType;
  public node: Node;
  public declaration?: any;
  public idMap: Array<IdDataType & { index: number }>;

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path)
    this.traverserThis = traverserThis
    this.node = this.path.node
    this.declaration = path.node['declarations'] && path.node['declarations'][0];
    this.idMap = [] as Array<IdDataType & { index: number }>
  }

  /**
   * @override
   */
  public run(): boolean | void {
    if (!this.beforeProcess()) return true
    this.replaceWith()
  }

  /**
   * @override
   */
  public beforeProcess(): boolean | void {
    const { declaration } = this

    if (!declaration) return false;

    const idElements = declaration.id && declaration.id.elements;
    if (!idElements) return false;

    const idMap = idElements.map((el, index) => {
      return { ...this.searchIdData(el), index }
    });

    const isExistRestElement = Object.entries(idMap).filter(([isRestElement]) => isRestElement).length > 0;
    if (!isExistRestElement) return false;

    this.idMap = idMap

    return true
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const { path, node, declaration, idMap } = this
    const initElements = declaration!.init && declaration!.init.elements;

    // e.g.)
    // var [a, b, ...c] = [1, '2', true, null, undefined, function () { }, Error, WebAssembly];
    // var [a, [b], [...c], [...d]] = [1, ['2'], [true, null, undefined], [function () { }, Error, WebAssembly]]
    const variableDeclarators = idMap.map(({ name, isRestElement, index, depth }) => {
      if (isRestElement) {
        const sliced = initElements.slice(index)
        let afterSlicedObj = sliced;
        if (sliced[0].type === 'ArrayExpression') afterSlicedObj = this.unnestedForRest(sliced[0].elements, depth);

        return t.variableDeclarator(
          t.identifier(name),
          Array.isArray(afterSlicedObj) ? t.arrayExpression(afterSlicedObj.map(node => t.cloneNode(node))) : t.cloneNode(afterSlicedObj)
        )
      } else {
        const initEl = initElements[index]
        let unnestedEl = initEl;
        if (initEl.type === 'ArrayExpression') unnestedEl = this.unnested(initEl.elements, depth);

        return t.variableDeclarator(
          t.identifier(name),
          t.cloneNode(unnestedEl)
        )
      }
    });

    const kind = node['kind']
    const statement = t.variableDeclaration(
      kind,
      variableDeclarators
    )

    path.replaceWith(statement)
  }


  private searchIdData(el: any, depth = 0): IdDataType {
    const elType = el.type
    switch (elType) {
      case 'ArrayPattern':
        depth++
        return this.searchIdData(el.elements[0], depth)
      case 'Identifier':
        return { name: el.name, isRestElement: false, depth }
      case 'RestElement':
        return { name: el.argument.name, isRestElement: true, depth }
    }
  }

  private unnested(arr: Array<any>, count: number): any {
    return count === 0 ?
      arr
      :
      [...Array(count).keys()].reduce((acc, _) => {
        acc = acc[0]
        return acc
      }, arr);
  }

  private unnestedForRest(arr: Array<any>, count: number): any {
    return count === 0 ?
      arr
      :
      [...Array(count).keys()].reduce((acc, _) => {
        if (acc.length > 0 && acc[0]['type'] === 'ArrayExpression') {
          count--
          acc = acc[0]
          return this.unnestedForRest(acc['elements'], count)
        } else {
          return acc
        }
      }, arr)
  }
}

import { NodePath, Node } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../BaseTraverser';
import { TraverserThisType } from '../../types';

type IdDataType = { name: string, isRestElement: boolean, depth: number }

export default class ArrayDestructuringTraverser extends BaseTraverser {
  public traverserThis: TraverserThisType;
  public node: Node;
  public declaration?: any;
  public idMap: Array<IdDataType & { index: number }>;
  public use_ref: boolean

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path)
    this.traverserThis = traverserThis
    this.node = this.path.node
    this.declaration = path.node['declarations'] && path.node['declarations'][0];
    this.idMap = [] as Array<IdDataType & { index: number }>
    this.use_ref = false
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
    const { path, declaration } = this

    if (!declaration) return false;

    const idElements = declaration.id && declaration.id.elements;
    if (!idElements) return false;

    const idMap = idElements.map((el, index) => {
      return { ...this.searchIdData(el), index }
    });

    const isExistRestElement = idMap.filter(({ isRestElement }) => isRestElement).length > 0;
    const initElements = declaration!.init && declaration!.init.elements;
    const isExistInitLocalBinding = initElements.filter(node => path.scope.hasOwnBinding(node.name)).length > 0;

    if (
      ((idElements.length !== initElements.length) && !isExistRestElement) ||
      isExistInitLocalBinding
    ) this.use_ref = true
    this.idMap = idMap

    return true
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const { path, node, declaration, idMap, use_ref } = this
    const { scope } = path
    const initElements = declaration!.init && declaration!.init.elements;

    let kind = node['kind'];
    let var_refDecl;
    let initObjects = initElements;
    let _refVariableDeclarators = [];
    if (use_ref) {

      // Creating _ref without name collision
      // [ref] http://hzoo.github.io/babel.github.io/docs/advanced/plugins/scope/
      const ref = scope.generateUidIdentifier("_ref");

      // _ref = [1, '2', true, null, undefined, function () { }, Error, WebAssembly];
      var_refDecl = t.variableDeclarator(
        ref,
        t.arrayExpression(initElements.map(node => t.cloneNode(node)))
      )

      // [ _ref[0], _ref[1], _ref[2], _ref[3] ]
      initObjects = initElements.map((node, index) => {
        return t.memberExpression(
          ref,
          t.numericLiteral(index),
          true
        )
      })

      kind = 'var';

      _refVariableDeclarators.push(var_refDecl)
    }

    // e.g.)
    // var [a, b, ...c] = [1, '2', true, null, undefined, function () { }, Error, WebAssembly];
    // var [a, [b], [...c], [...d]] = [1, ['2'], [true, null, undefined], [function () { }, Error, WebAssembly]]
    const mainVariableDeclarators = idMap.map(({ name, isRestElement, index, depth }) => {
      if (isRestElement) {
        const sliced = initElements.slice(index)
        let afterSlicedObj = sliced;
        if (sliced[0].type === 'ArrayExpression') afterSlicedObj = this.unnestedForRest(sliced[0].elements, depth);

        return t.variableDeclarator(
          t.identifier(name),
          Array.isArray(afterSlicedObj) ? t.arrayExpression(afterSlicedObj.map(node => t.cloneNode(node))) : t.cloneNode(afterSlicedObj)
        )
      } else {
        const initEl = initObjects[index]
        let unnestedEl = initEl;
        if (initEl.type === 'ArrayExpression') unnestedEl = this.unnested(initEl.elements, depth);

        return t.variableDeclarator(
          t.identifier(name),
          t.cloneNode(unnestedEl)
        )
      }
    });

    const statement = t.variableDeclaration(
      kind,
      [..._refVariableDeclarators, ...mainVariableDeclarators]
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

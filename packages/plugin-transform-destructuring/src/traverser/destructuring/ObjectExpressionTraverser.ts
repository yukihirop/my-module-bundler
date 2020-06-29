import { NodePath, Node } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../BaseTraverser';
import { TraverserThisType } from '../../types';
import helper from '../../helper'
import { HelperBuilder } from '../../helperImpl';

type IdDataType = { name: string, isRestElement: boolean, depth: number }

export default class ObjectExpressionTraverser extends BaseTraverser {
  public traverserThis: TraverserThisType;
  public node: Node;
  public declaration?: any;
  public idMap: Array<IdDataType & { index: number }>;
  public h: HelperBuilder

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path)
    this.traverserThis = traverserThis
    this.node = this.path.node
    this.declaration = path.node['declarations'] && path.node['declarations'][0];
    this.idMap = [] as Array<IdDataType & { index: number }>
    this.h = helper("_objectWithoutProperties", path)
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
    const {
      declaration,
      traverserThis,
      h
    } = this

    if (!declaration) return false;

    const idProperties = declaration.id && declaration.id.properties;
    if (!idProperties) return false;

    const idMap = idProperties.map((el, index) => {
      return { ...this.searchIdData(el), index }
    });

    const isExistRestElement = idMap.filter(({ isRestElement }) => isRestElement).length > 0;
    if (isExistRestElement && !traverserThis.isAddHelper) {
      traverserThis.beforeStatements.push(...h.buildStatements())
      this.traverserThis.isAddHelper = true
    }

    this.idMap = idMap

    return true
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const {
      path,
      node,
      declaration,
      idMap,
      h
    } = this
    const { scope } = path
    const initProperties = declaration!.init && declaration!.init.properties;

    let kind = node['kind'];
    let var_refDecl;
    let initObjects = initProperties;
    let _refVariableDeclarators = [];

    // Creating _ref without name collision
    // [ref] http://hzoo.github.io/babel.github.io/docs/advanced/plugins/scope/
    //
    // e.g.) uid = _a$b$c
    const uid = scope.generateUidIdentifierBasedOnNode(declaration.init);

    // _a$b$c = { a: 1, b: '2', c: true };
    var_refDecl = t.variableDeclarator(
      uid,
      t.objectExpression(initObjects.map(node => t.cloneNode(node)))
    )

    kind = 'var';
    _refVariableDeclarators.push(var_refDecl)

    // e.g.)
    // var {a, b, ...c} = [a: 1, b: '2', c: true, d: null, e: undefined, f: function () { }, g: Error, h: WebAssembly];
    // var {a, b, c, ...d} = {a: 1, b: { b1: '2'}, c: { c1: true, c2: null, c3: undefined }, d: { d1: function () { }, d2: Error, d3: WebAssembly}}
    const excludedkeys = idMap.reduce((acc, { name, isRestElement }) => {
      if (!isRestElement) acc.push(name)
      return acc
    }, [])
    const mainVariableDeclarators = idMap.map(({ name, isRestElement, index, depth }) => {
      if (isRestElement) {
        return t.variableDeclarator(
          t.identifier(name),
          t.callExpression(
            t.identifier(h.helperName),
            [
              uid,
              t.arrayExpression(excludedkeys.map(key => t.stringLiteral(key)))
            ]
          )
        )
      } else {
        return t.variableDeclarator(
          t.identifier(name),
          t.memberExpression(
            uid,
            t.identifier(name),
            false
          )
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
    const type =
      el.key && el.key.type ||
      el.type
    switch (type) {
      case 'ObjectPattern':
        depth++
        return this.searchIdData(el.properties[0], depth)
      case 'Identifier':
        return { name: el.key.name, isRestElement: false, depth }
      case 'RestElement':
        return { name: el.argument.name, isRestElement: true, depth }
    }
  }

  private unnestedForRest(arr: Array<any>, count: number): any {
    return count === 0 ?
      arr
      :
      [...Array(count).keys()].reduce((acc, _) => {
        if (acc.length > 0 && acc[0]['type'] === 'ObjectExpression') {
          count--
          acc = acc[0]
          return this.unnestedForRest(acc['properties'], count)
        } else {
          return acc
        }
      }, arr)
  }
}

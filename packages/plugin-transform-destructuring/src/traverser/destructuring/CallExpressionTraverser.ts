import { NodePath, Node } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../BaseTraverser';
import { TraverserThisType } from '../../types';
import { HelperBuilder } from '../../helperImpl';
import helper from '../../helper'

type IdDataType = { name: string, isRestElement: boolean, depth: number }

export default class ObjectExpressionTraverser extends BaseTraverser {
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
    const {
      declaration
    } = this

    if (!declaration) return false;

    const initCallee = declaration.init && declaration.init.callee;
    if (!initCallee) return false;

    const idElements = declaration.id && declaration.id.elements;
    if (!idElements) return false;

    const idMap = idElements.map((el, index) => {
      return { ...this.searchIdData(el), index }
    });

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
      traverserThis
    } = this
    const h = helper("_slicedToArray", path) as HelperBuilder
    const { scope } = path
    const initCallee = declaration!.init && declaration!.init.callee;

    let kind = node['kind'];
    let beforeVariableDeclarators = [];

    // e.g.)
    // var _f = f();
    const renameUid = scope.generateUidIdentifier(initCallee.name);
    const var_renameDecl = t.variableDeclarator(
      renameUid,
      t.callExpression(
        t.identifier(initCallee.name),
        declaration.init.arguments
      )
    )

    // e.g.)
    // var _f2 = _slicedToArray(_f, 2);
    const idElements = declaration.id && declaration.id.elements;
    const _slicedToArrayVarName = scope.generateUidIdentifier(initCallee.name);
    const var_refDecl = t.variableDeclarator(
      _slicedToArrayVarName,
      t.callExpression(
        t.identifier(h.helperName),
        [
          renameUid,
          t.numericLiteral(idElements.length)
        ]
      )
    )

    kind = 'var';
    beforeVariableDeclarators.push(var_renameDecl, var_refDecl)

    // e.g.)
    // function f(){ return [1,2] }
    // var [a, b] = f();
    const mainVariableDeclarators = idMap.map(({ name, isRestElement, index }) => {
      if (isRestElement) {
      } else {
        return t.variableDeclarator(
          t.identifier(name),
          t.memberExpression(
            _slicedToArrayVarName,
            t.numericLiteral(index),
            true
          )
        )
      }
    });

    const statement = t.variableDeclaration(
      kind,
      [...beforeVariableDeclarators, ...mainVariableDeclarators]
    )

    traverserThis.beforeStatements.push(...h.buildStatements())
    traverserThis.LazyEvaluateStatement.push({ path, statement })
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
        return { name: el.name, isRestElement: false, depth }
      case 'RestElement':
        return { name: el.argument.name, isRestElement: true, depth }
    }
  }
}

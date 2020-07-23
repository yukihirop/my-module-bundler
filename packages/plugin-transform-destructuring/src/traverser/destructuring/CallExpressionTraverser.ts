import { NodePath, Node } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../BaseTraverser';
import { TraverserThisType } from '../../types';

type IdDataType = { name: string; isRestElement: boolean; depth: number };

export default class ObjectExpressionTraverser extends BaseTraverser {
  public traverserThis: TraverserThisType;
  public node: Node;
  public declaration?: any;
  public idMap: Array<IdDataType & { index: number }>;
  public usedUids: t.Identifier[];
  public toArrayHelper?: t.Identifier;
  public slicedToArrayHelper?: t.Identifier;

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path);
    this.traverserThis = traverserThis;
    this.node = this.path.node;
    this.declaration = path.node['declarations'] && path.node['declarations'][0];
    this.idMap = [] as Array<IdDataType & { index: number }>;
    this.usedUids = [];
    this.toArrayHelper = null;
    this.slicedToArrayHelper = null;
  }

  /**
   * @override
   */
  public run(): boolean | void {
    if (!this.beforeProcess()) return true;
    this.replaceWith();
  }

  /**
   * @override
   */
  public beforeProcess(): boolean | void {
    const { declaration, traverserThis } = this;

    if (!declaration) return false;

    const initCallee = declaration.init && declaration.init.callee;
    if (!initCallee) return false;

    const idElements = declaration.id && declaration.id.elements;
    if (!idElements) return false;

    const idMap = idElements.map((el, index) => {
      return { ...this.searchIdData(el), index };
    });

    const isExistRestElement = idMap.filter(({ isRestElement }) => isRestElement).length > 0;
    if (isExistRestElement) {
      // @ts-ignore
      this.toArrayHelper = traverserThis.addUDFHelper('udf_toArray');
    } else {
      // @ts-ignore
      this.slicedToArrayHelper = traverserThis.addUDFHelper('udf_slicedToArray');
    }

    this.idMap = idMap;

    return true;
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
      traverserThis,
      usedUids,
      toArrayHelper,
      slicedToArrayHelper,
    } = this;

    const { scope } = path;
    const initCallee = declaration!.init && declaration!.init.callee;

    let kind = node['kind'];
    let beforeVariableDeclarators = [];

    // e.g.)
    // var _f = f();
    const renameUid = scope.generateUidIdentifier(initCallee.name);
    usedUids.push(renameUid);

    const var_renameDecl = t.variableDeclarator(
      renameUid,
      t.callExpression(t.identifier(initCallee.name), declaration.init.arguments)
    );

    // e.g.)
    // var _f2 = _slicedToArray(_f, 2);
    const idElements = declaration.id && declaration.id.elements;
    const _slicedToArrayVarName = scope.generateUidIdentifier(initCallee.name);
    usedUids.push(_slicedToArrayVarName);

    const var_refDecl = t.variableDeclarator(
      _slicedToArrayVarName,
      t.callExpression(t.identifier(slicedToArrayHelper.name), [
        renameUid,
        t.numericLiteral(idElements.length),
      ])
    );

    kind = 'var';
    beforeVariableDeclarators.push(var_renameDecl, var_refDecl);

    // e.g.)
    // function f(){ return [1,2] }
    // var [a, b] = f();
    const mainVariableDeclarators = idMap.reduce((acc, { name, isRestElement, index, depth }) => {
      if (isRestElement) {
        const idElements = declaration.id && declaration.id.elements;
        const type = idElements[index].type;

        switch (type) {
          // e.g.)
          //
          // _f2$2 = _toArray(_f2[2]),
          // c = _f2$2.slice(0),
          case 'ArrayPattern':
            const { [0]: firstUid, length: l, [l - 1]: lastUid } = usedUids;
            const uid = scope.generateUidIdentifier(lastUid.name);
            usedUids.push(uid);

            // _f2$2 = _toArray(_f2[2])
            const vd1 = t.variableDeclarator(
              uid,
              t.callExpression(t.identifier(toArrayHelper.name), [
                t.memberExpression(firstUid, t.numericLiteral(index), true),
              ])
            );
            // c = _f2$2.slice(0)
            const vd2 = t.variableDeclarator(
              t.identifier(name),
              t.callExpression(t.memberExpression(uid, t.identifier('slice'), false), [
                t.numericLiteral(0),
              ])
            );
            acc.push(vd1, vd2);

            break;
          case 'RestPattern':
            break;
        }
      } else {
        if (depth > 0) {
          const uid = scope.generateUidIdentifier(_slicedToArrayVarName.name);
          usedUids.push(uid.name);

          // e.g.)
          // _f2$ = _slicedToArray(_f2[1], 1)
          const vd1 = t.variableDeclarator(
            uid,
            t.callExpression(t.identifier(slicedToArrayHelper.name), [
              _slicedToArrayVarName,
              t.numericLiteral(depth),
            ])
          );
          // e.g.)
          // b = _f2$[0]
          const vd2 = t.variableDeclarator(
            t.identifier(name),
            t.memberExpression(uid, t.numericLiteral(0), true)
          );
          acc.push(vd1, vd2);
        } else {
          // e.g.)
          // a = _f2[0]
          const vd = t.variableDeclarator(
            t.identifier(name),
            t.memberExpression(_slicedToArrayVarName, t.numericLiteral(index), true)
          );
          acc.push(vd);
        }
      }
      return acc;
    }, []);

    const statement = t.variableDeclaration(kind, [
      ...beforeVariableDeclarators,
      ...mainVariableDeclarators,
    ]);

    traverserThis.LazyEvaluateStatement.push({ path, statement });
  }

  private searchIdData(el: any, depth = 0): IdDataType {
    const type = (el.key && el.key.type) || el.type;
    switch (type) {
      case 'ObjectPattern':
        depth++;
        return this.searchIdData(el.properties[0], depth);
      case 'Identifier':
        return { name: el.name, isRestElement: false, depth };
      case 'RestElement':
        return { name: el.argument.name, isRestElement: true, depth };
      case 'ArrayPattern':
        depth++;
        return this.searchIdData(el.elements[0], depth);
    }
  }
}

import { GlobalThisType } from './../../types';
import { NodePath } from '@babel/traverse';
import BaseTraverser from '../BaseTraverser';
import * as t from '@babel/types';

import { buildExportsStatement } from '../../statement';

import { functionize } from '../../helper';

export default class DefaultDeclarationTraverser extends BaseTraverser {
  public globalThis: GlobalThisType;
  public declaration:
    | t.ObjectExpression
    | t.ArrayExpression
    | t.FunctionDeclaration
    | t.CallExpression
    | t.NewExpression
    | t.Identifier;
  public exportValueType: string;
  public exportValue: string;
  public idName: string;
  public nodeExpression?:
    | t.ObjectExpression
    | t.ArrayExpression
    | t.CallExpression
    | t.NewExpression
    | t.Identifier
    | t.Expression;
  public nodeDeclaration?: t.FunctionDeclaration;

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path);
    this.globalThis = globalThis;
    this.declaration = path.node['declaration'];
    this.exportValue = this.declaration['value'];
    this.exportValueType = this.declaration['type'];
    this.idName = this.declaration['id'] ? this.declaration['id'].name : '_default';
    this.nodeExpression = null;
    this.nodeDeclaration = null;
  }

  /**
   * @override
   */
  public beforeProcess() {
    const { declaration, exportValue, exportValueType } = this;

    switch (exportValueType) {
      // e.g.)
      // export default { a: a, b: b, k: () => { } };
      case 'ObjectExpression':
        this.nodeExpression = t.objectExpression((declaration as t.ObjectExpression).properties);
        break;
      // e.g.)
      // export default [a, b];
      case 'ArrayExpression':
        this.nodeExpression = t.arrayExpression((declaration as t.ArrayExpression).elements);
        break;
      // e.g.)
      // export default function (a) { return a }
      case 'FunctionDeclaration':
        const { idName } = this;
        this.nodeDeclaration = t.functionDeclaration(
          t.identifier(idName),
          (declaration as t.FunctionDeclaration).params,
          (declaration as t.FunctionDeclaration).body
        );
        break;
      // e.g.)
      // export default (function () { return "a" })();
      case 'CallExpression':
        this.nodeExpression = t.callExpression(
          (declaration as t.CallExpression).callee,
          (declaration as t.CallExpression).arguments
        );
        break;
      // e.g.)
      // export default new A()
      case 'NewExpression':
        this.nodeExpression = t.newExpression(
          (declaration as t.NewExpression).callee,
          (declaration as t.NewExpression).arguments
        );
        break;
      // e.g.)
      // export default a
      case 'Identifier':
        this.nodeExpression = t.identifier((declaration as t.Identifier).name);
        break;
      // e.g.)
      // export default true
      // export default 1
      default:
        this.nodeExpression = eval(
          `t.${functionize(exportValueType)}(${exportValue})`
        ) as t.Expression;
        break;
    }
  }

  /**
   * @override
   */
  public insertBefore(): void {
    const { globalThis } = this;
    // e.g.)
    //
    // Object.defineProperty(exports, "__esModule", {
    //   value: true
    // });
    // exports.default = void 0;
    // var _default = <ArrayExpression | ObjectExpression | Literal>;
    // exports.default = _default;
    globalThis.ExportsVoid0Statement.push('default');
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const { path, nodeExpression, nodeDeclaration } = this;
    const varStatement = t.variableDeclaration('var', [
      t.variableDeclarator(t.identifier('_default'), nodeExpression),
    ]);

    let program;
    if (nodeDeclaration) {
      program = t.program([nodeDeclaration]);
    } else {
      program = t.program([varStatement]);
    }

    path.replaceWith(program);
  }

  /**
   * @override
   */
  public insertAfter(): void {
    const { path, idName } = this;
    const afterStatements = [buildExportsStatement('default', idName)];
    const afterProgram = t.program(afterStatements);
    path.insertAfter(afterProgram);
  }
}

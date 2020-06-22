import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { basename } from 'path';

import { NodeType, VariableKindType, GlobalThisType, PluginOptionsType } from '../../types';
import BaseTraverser from '../BaseTraverser';

import {
  buildExportsStatement,
  buildDefinePropertyExportNamedStatement,
  buildRequireStatement,
  _interopRequireDefault,
} from '../../statement';

import { judgeRequireType, INTEROP_REQUIRE_DEFAULT, REQUIRE, ES_MODULE } from '../../helper';

export default class NamedDeclarationTraverser extends BaseTraverser {
  public globalThis: GlobalThisType;
  public specifiers: t.ExportSpecifier[];
  public source?: any;
  public declaration?: t.FunctionDeclaration | t.VariableDeclaration | t.ClassDeclaration;
  public nodeType: NodeType;
  public variableKind: VariableKindType;
  public isFunctionExpression: boolean;
  public beforeStatements: t.Statement[];
  public afterStatements: t.Statement[];
  public options: PluginOptionsType;

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path);
    this.globalThis = globalThis;
    this.specifiers = path.node['specifiers'];
    this.source = path.node['source'];
    this.declaration = path.node['declaration'];
    this.nodeType = path.node['type'] as NodeType;
    this.variableKind = 'var' as VariableKindType;
    this.isFunctionExpression = true;
    this.beforeStatements = [] as t.Statement[];
    this.afterStatements = [] as t.Statement[];
    this.options = globalThis.opts;
  }

  public beforeProcess(): void {
    const { nodeType, declaration } = this;

    switch (nodeType) {
      case 'FunctionDeclaration':
        this.isFunctionExpression = declaration['expression'];
        break;
      case 'VariableDeclaration':
        this.variableKind = declaration['kind'];
        break;
    }
  }

  /**
   * @override
   */
  public run(): void {
    const { globalThis, path, specifiers, source, afterStatements, declaration, options } = this;
    const { noInterop } = options

    this.beforeProcess();

    // CASE 1
    //
    // e.g.)
    // export { a }
    // export { a, b }
    if (specifiers.length > 0 && !source) {
      specifiers.forEach((specifier: t.ExportSpecifier) => {
        const exportedName = specifier.exported.name as string;
        const localName = specifier.local.name as string;
        const localBinding = path.scope.getBinding(localName);
        if (exportedName === ES_MODULE) throw new Error(`Illegal export "${ES_MODULE}"`);

        // Use toString() to workaround Error:
        // This condition will always return 'true' since the types '"var" | "const" | "let" | "module"' and '"kind"' have no overlap.ts(2367)
        if (localBinding['kind'].toString() === 'hoisted') {
          globalThis.beforeStatements.push(buildExportsStatement(exportedName, localName));
        } else {
          globalThis.ExportsVoid0Statement.push(exportedName);
          afterStatements.push(buildExportsStatement(exportedName, localName));
        }
      });

      const afterProgram = t.program(afterStatements);
      path.insertAfter(afterProgram);
      // If you do not call it at the end, you will get the following error
      // SyntaxError: unknown: NodePath has been removed so is read-only.
      path.remove();

      // CASE 2
      //
      // e.g.)
      // export { b, c } from './a.js'
      // export { b as c } from './a.js'
      // export { b as default } from './a.js'
      // export { default as c } from './a.js'
    } else if (specifiers.length > 0 && source) {
      const sourceName = source.value;
      const moduleName = basename(sourceName).split('.')[0];
      const requireType = judgeRequireType(specifiers, 'export');

      specifiers.forEach((specifier: t.ExportSpecifier) => {
        const exportedName = specifier.exported.name;
        const localName = specifier.local ? specifier.local.name : null;

        globalThis.beforeStatements.push(
          buildDefinePropertyExportNamedStatement(moduleName, exportedName, localName)
        );
      });

      let requireStatement;
      if (noInterop) {
        requireStatement = buildRequireStatement(moduleName, sourceName, REQUIRE, true);
      } else {
        requireStatement = buildRequireStatement(moduleName, sourceName, requireType, true);
        if (requireType === INTEROP_REQUIRE_DEFAULT) afterStatements.push(_interopRequireDefault);
      }

      path.replaceWith(requireStatement);
      path.insertAfter(afterStatements);

      // CASE 3
      //
      // TODO: There is no end if it is implemented separately for each case.
      // e.g.)
      // ○: FunctionDeclaration: export function a() {}
      // ○: FunctionExpression:  export var a = function(){};
      // ○: ClassDeclaration:    export class A{}
      // x: ClassExpression?:    export var a = calss A{}
    } else if (declaration) {
      const declarationType = declaration.type;
      let statements = [];
      let exportedName = 'default';
      let childDeclaration, statement;

      switch (declarationType) {
        // CASE 3.1
        //
        // e.g.)
        // export function a() {}
        case 'FunctionDeclaration':
          exportedName = (declaration as t.FunctionDeclaration).id.name;
          statement = t.functionDeclaration(
            t.identifier(exportedName),
            (declaration as t.FunctionDeclaration).params,
            (declaration as t.FunctionDeclaration).body
          );
          statements.push(statement);
          // Function Declaration should be hoisting
          //
          // e.g.)
          //
          // exports.hoist = hoist
          globalThis.beforeStatements.push(buildExportsStatement(exportedName, exportedName));

          break;

        // CASE 3.2
        //
        // e.g.)
        // export var a = function(){}
        case 'VariableDeclaration':
          const { isFunctionExpression, variableKind } = this;
          childDeclaration = (declaration as t.VariableDeclaration).declarations[0];
          exportedName = childDeclaration['id'].name;
          statement = t.variableDeclaration(variableKind, [
            t.variableDeclarator(t.identifier(exportedName), childDeclaration['init']),
          ]);

          statements.push(statement);

          //　Function Expression is not hoisted
          //
          // e.g.)
          //
          // exports.not_hoist = void 0
          //
          // var not_hoist = function(){}
          //
          // exports.not_hoist = not_hoist
          if (isFunctionExpression) {
            globalThis.ExportsVoid0Statement.push(exportedName);
            afterStatements.push(buildExportsStatement(exportedName, exportedName));
          }
          break;

        // CASE 3.3
        //
        // e.g.)
        // export class A{}
        case 'ClassDeclaration':
          exportedName = (declaration as t.ClassDeclaration).id.name;
          const nodeDeclaration = t.classDeclaration(
            t.identifier(exportedName),
            null,
            (declaration as t.ClassDeclaration).body,
            null
          );
          statements.push(nodeDeclaration);
          globalThis.ExportsVoid0Statement.push(exportedName);
          afterStatements.push(buildExportsStatement(exportedName, exportedName));
          break;
      }

      const mainProgram = t.program(statements);
      const afterProgram = t.program(afterStatements);
      path.replaceWith(mainProgram);
      path.insertAfter(afterProgram);
    }
  }
}

import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import BaseTraverser from '../BaseTraverser';
import { basename } from 'path';

import { GlobalThisType } from './../../types';
import {
  buildRequireStatement,
  _interopRequireDefault,
  _interopRequireWildcard,
  _getRequireWildcardCache
} from '../../statement';
import {
  judgeRequireType,
  createImportedMap,
  REQUIRE,
  INTEROP_REQUIRE_DEFAULT,
  INTEROP_REQUIRE_WILDCARD
} from '../../helper'

export default class DeclarationTraverser extends BaseTraverser {
  public globalThis: GlobalThisType
  public specifiers: t.ImportSpecifier[] | t.ImportNamespaceSpecifier[] | t.ImportDefaultSpecifier[]
  public source: t.Literal
  public beforeStatements: t.Statement[]
  public statements: t.Statement[]
  public afterStatements: t.Statement[]

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path)
    this.globalThis = globalThis
    this.specifiers = path.node['specifiers'];
    this.source = path.node['source'];
    this.beforeStatements = [] as t.Statement[];
    this.statements = [] as t.Statement[];
    this.afterStatements = [] as t.Statement[];
  }

  /**
   * @override
   */
  public run(): void {
    const {
      path,
      specifiers,
      source,
      statements
    } = this

    // e.g.)
    // import './spec/a.js'
    if (specifiers.length === 0 && source) {
      const sourceName = (source as t.StringLiteral).value;
      const statement = buildRequireStatement(null, sourceName, 'require');

      statements.push(statement)
      const mainProgram = t.program(statements)
      path.replaceWith(mainProgram);

      // e.g.)
      // import b from './a.js';
    } else if (specifiers.length > 0 && source) {
      const { afterStatements } = this
      const sourceName = (source as t.StringLiteral).value;
      const moduleName = basename(sourceName).split('.')[0];
      const requireType = judgeRequireType<t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier>(specifiers, "import");
      let statement, localName;

      switch (requireType) {
        case REQUIRE:
          localName = `_${moduleName}`

          statement = buildRequireStatement(moduleName, sourceName, requireType);
          statements.push(statement)
          break;
        case INTEROP_REQUIRE_DEFAULT:
          this.globalThis.IsESModule = true
          localName = `_${moduleName}`

          statement = buildRequireStatement(moduleName, sourceName, requireType);
          statements.push(statement)
          afterStatements.push(_interopRequireDefault);
          break;
        case INTEROP_REQUIRE_WILDCARD:
          this.globalThis.IsESModule = true
          if (specifiers.length > 1) {
            localName = `_${moduleName}`
          } else {
            localName = (specifiers as any[]).map(s => s["local"] ? s["local"].name : undefined).filter(Boolean)[0]
          }

          statement = buildRequireStatement(localName, sourceName, requireType);
          statements.push(statement)
          afterStatements.push(_getRequireWildcardCache, _interopRequireWildcard);
          break;
      }

      this.globalThis.importedMap = createImportedMap(localName, specifiers)

      const mainProgram = t.program(statements)
      path.replaceWith(mainProgram);
      path.insertAfter(afterStatements);
    }
  }
}

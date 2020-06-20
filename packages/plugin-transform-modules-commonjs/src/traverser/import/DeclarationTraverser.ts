import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import BaseTraverser from '../BaseTraverser';
import { basename } from 'path';

import { GlobalThisType, MapValueType } from './../../types';
import {
  buildRequireStatement,
  _interopRequireDefault,
  _interopRequireWildcard,
  _getRequireWildcardCache,
} from '../../statement';
import {
  judgeRequireType,
  createImportedMapData,
  REQUIRE,
  INTEROP_REQUIRE_DEFAULT,
  INTEROP_REQUIRE_WILDCARD,
} from '../../helper';

export default class DeclarationTraverser extends BaseTraverser {
  public globalThis: GlobalThisType;
  public specifiers:
    | t.ImportSpecifier[]
    | t.ImportNamespaceSpecifier[]
    | t.ImportDefaultSpecifier[];
  public source: t.Literal;

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path);
    this.globalThis = globalThis;
    this.specifiers = path.node['specifiers'];
    this.source = path.node['source'];
  }

  /**
   * @override
   */
  public run(): void {
    const { globalThis, path, specifiers, source } = this;

    // e.g.)
    // import './spec/a.js'
    if (specifiers.length === 0 && source) {
      const sourceName = (source as t.StringLiteral).value;
      const statement = buildRequireStatement(null, sourceName, 'require');

      globalThis.beforeStatements.push(statement);

      // e.g.)
      // import b from './a.js';
    } else if (specifiers.length > 0 && source) {
      const sourceName = (source as t.StringLiteral).value;
      const moduleName = basename(sourceName).split('.')[0];
      const requireType = judgeRequireType<
        t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier
      >(specifiers, 'import');
      let statement, localName;

      switch (requireType) {
        case REQUIRE:
          localName = `_${moduleName}`;

          statement = buildRequireStatement(moduleName, sourceName, requireType);
          globalThis.beforeStatements.push(statement);
          break;
        case INTEROP_REQUIRE_DEFAULT:
          localName = `_${moduleName}`;

          statement = buildRequireStatement(moduleName, sourceName, requireType);
          globalThis.beforeStatements.push(statement, _interopRequireDefault);
          break;
        case INTEROP_REQUIRE_WILDCARD:
          if (specifiers.length > 1) {
            localName = `_${moduleName}`;
          } else {
            localName = (specifiers as any[])
              .map((s) => (s['local'] ? s['local'].name : undefined))
              .filter(Boolean)[0];
          }

          statement = buildRequireStatement(localName, sourceName, requireType);
          globalThis.beforeStatements.push(statement, _getRequireWildcardCache, _interopRequireWildcard);
          break;
      }

      createImportedMapData(localName, specifiers).forEach((data: [string, MapValueType]) => {
        this.globalThis.importedMap.set(...data)
      });
    }

    // If path.remove() is performed here, localBinding will be canceled and import hoisting processing will be affected.
    // So keep the path to erase to make path.remove at the end
    globalThis.willRemovePaths.push(path)
  }
}

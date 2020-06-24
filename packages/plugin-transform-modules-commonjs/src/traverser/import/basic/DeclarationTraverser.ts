import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import BaseTraverser from '../../BaseTraverser';
import { basename } from 'path';

import { TraverserThisType, MapValueType, PluginOptionsType } from '../../../types';
import {
  buildRequireStatement,
  _interopRequireDefault,
  _interopRequireWildcard,
  _getRequireWildcardCache,
} from '../../../statement';
import {
  judgeRequireType,
  judgeImportOrExportType,
  createImportedMapData,
  TYPE_DEFAULT,
  TYPE_WILDCARD,
  TYPE_OTHER,
  REQUIRE,
} from '../../../helper';

export default class DeclarationTraverser extends BaseTraverser {
  public traverserThis: TraverserThisType;
  public specifiers:
    | t.ImportSpecifier[]
    | t.ImportNamespaceSpecifier[]
    | t.ImportDefaultSpecifier[];
  public source: t.Literal;
  public options: PluginOptionsType;

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path);
    this.traverserThis = traverserThis;
    this.specifiers = path.node['specifiers'];
    this.source = path.node['source'];
    this.options = traverserThis.opts;
  }

  /**
   * @override
   */
  public run(): void {
    const { traverserThis, path, specifiers, source, options } = this;
    const { noInterop } = options;

    // e.g.)
    // import './spec/a.js'
    if (specifiers.length === 0 && source) {
      const sourceName = (source as t.StringLiteral).value;
      const statement = buildRequireStatement(null, sourceName, REQUIRE, true);

      traverserThis.beforeStatements.push(statement);

      // e.g.)
      // interop
      // import b from './a.js';
    } else if (specifiers.length > 0 && source) {
      const sourceName = (source as t.StringLiteral).value;
      const moduleName = basename(sourceName).split('.')[0];
      const requireType = judgeRequireType<
        t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier
      >(specifiers, 'import');
      const importType = judgeImportOrExportType<
        t.ImportNamespaceSpecifier | t.ImportDefaultSpecifier | t.ImportSpecifier
      >(specifiers, 'import');
      let statement, localName;

      switch (importType) {
        case TYPE_OTHER:
          localName = `_${moduleName}`;

          statement = buildRequireStatement(moduleName, sourceName, REQUIRE, true);
          traverserThis.beforeStatements.push(statement);
          break;
        case TYPE_DEFAULT:
          localName = `_${moduleName}`;

          if (noInterop) {
            statement = buildRequireStatement(moduleName, sourceName, REQUIRE, true);
            traverserThis.beforeStatements.push(statement);
          } else {
            statement = buildRequireStatement(moduleName, sourceName, requireType, false);
            traverserThis.beforeStatements.push(statement, _interopRequireDefault);
          }
          break;
        // e.g.)
        // import * as b from './a.js'
        // import b, { a as c } from './a.js'
        case TYPE_WILDCARD:
          // import b, { a as c } from './a.js'
          if (specifiers.length > 1) {
            localName = `_${moduleName}`;
            // import * as b from './a.js'
          } else {
            localName = (specifiers as any[])
              .map((s) => (s['local'] ? s['local'].name : undefined))
              .filter(Boolean)[0];
          }

          if (noInterop) {
            statement = buildRequireStatement(localName, sourceName, REQUIRE, false);
            traverserThis.beforeStatements.push(statement);
          } else {
            statement = buildRequireStatement(localName, sourceName, requireType, false);
            traverserThis.beforeStatements.push(
              statement,
              _getRequireWildcardCache,
              _interopRequireWildcard
            );
          }
          break;
      }

      createImportedMapData(localName, specifiers).forEach((data: [string, MapValueType]) => {
        this.traverserThis.importedMap.set(...data);
      });
    }

    // If path.remove() is performed here, localBinding will be canceled and import hoisting processing will be affected.
    // So keep the path to erase to make path.remove at the end
    traverserThis.willRemovePaths.push(path);
  }
}

import { NodePath } from '@babel/traverse';
import BaseTraverser from '../BaseTraverser';
import { basename } from 'path';

import { buildRequireStatement, buildDefinePropertyExportsStatement } from '../../statement';
import { REQUIRE } from '../../helper';

export default class AllDeclarationTraverser extends BaseTraverser {
  public sourceName: string;
  public moduleName: string;

  constructor(path: NodePath) {
    super(path);
    this.sourceName = path.node['source'].value;
    this.moduleName = basename(this.sourceName).split('.')[0];
  }

  /**
   * @override
   */
  public beforeProcess(): void {}

  /**
   * @override
   */
  public insertBefore(): void {}

  /**
   * @override
   */
  public replaceWith(): void {
    const { moduleName, sourceName } = this;
    const statement = buildRequireStatement(moduleName, sourceName, REQUIRE, true);
    this.path.replaceWith(statement);
  }

  /**
   * @override
   */
  public insertAfter(): void {
    const { moduleName } = this;
    const statement = buildDefinePropertyExportsStatement(moduleName);
    this.path.insertAfter(statement);
  }
}

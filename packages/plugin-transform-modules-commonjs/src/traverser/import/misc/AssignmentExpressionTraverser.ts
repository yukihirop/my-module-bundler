import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

import BaseTraverser from '../../BaseTraverser';
import { TraverserThisType } from '../../../types';
import { importConstThrowAst } from '../../../statement';

export default class AssignmentExpressionTraverser extends BaseTraverser {
  private IGNORE_REFERENCED_LIST = ['require', 'module', 'exports'];
  public traverserThis: TraverserThisType;
  public nodeName: string;

  constructor(path: NodePath, traverserThis: TraverserThisType) {
    super(path);
    this.traverserThis = traverserThis;
    this.nodeName = path.node['name'];
  }

  /**
   * @override
   */
  public run(): void | boolean {
    if (this.beforeProcess()) return true;
    this.replaceWith();
  }

  /**
   * @override
   */
  public beforeProcess(): boolean {
    const { nodeName } = this;
    if (this.IGNORE_REFERENCED_LIST.includes(nodeName)) return true;
    return false;
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const { path, traverserThis } = this;
    const nodeType = path.node['type'];
    switch (nodeType) {
      case 'AssignmentExpression':
        const nodeLeft = path.node['left'];
        const nodeRight = path.node['right'];
        // Since the purpose is to raise an error, even if there are multiple unwritable global variables, only the first one will be fetched.
        const nodeLeftName =
          (nodeLeft.properties && nodeLeft.properties[0].value.name) ||
          (nodeLeft.elements && nodeLeft.elements[0].name) ||
          (nodeLeft.name && nodeLeft.name);
        const importedMap = traverserThis.importedMap.get(nodeLeftName);
        if (importedMap) {
          const expression = t.sequenceExpression([nodeRight, importConstThrowAst(nodeLeftName)]);
          path.node['right'] = expression;
        }
        break;
    }
  }
}

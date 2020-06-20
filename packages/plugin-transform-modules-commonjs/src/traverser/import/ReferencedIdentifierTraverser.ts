import { NodePath, Binding } from '@babel/traverse';
import BaseTraverser from '../BaseTraverser';

import { GlobalThisType } from './../../types';
import { buildSequenceExpressionOrNot } from '../../statement'

export default class ReferencedIdentifierTraverser extends BaseTraverser {
  private IGNORE_REFERENCED_LIST = ['require', 'module', 'exports'];
  public globalThis: GlobalThisType;
  public nodeName: string;
  public localBinding: Binding;

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path);
    this.globalThis = globalThis;
    this.nodeName = path.node['name'];
    this.localBinding = path.scope.getBinding(this.nodeName);
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
    const { nodeName, localBinding } = this;
    if (this.IGNORE_REFERENCED_LIST.includes(nodeName)) return true;
    if (!localBinding || localBinding.kind !== 'module') return true;
    return false;
  }

  /**
   * @override
   */
  public replaceWith(): void {
    const { globalThis, path, localBinding } = this;
    const idName = localBinding.identifier.name;
    const mapValue = globalThis.importedMap.get(idName);

    if (mapValue) {
      const { statement, isSequenceExpression } = buildSequenceExpressionOrNot(path, globalThis)

      if (isSequenceExpression) {
        path.parentPath.replaceWith(statement);
      } else {
        path.replaceWith(statement);
      }
    } else {
      // Unwind unreferenced statement at runtime
      // That is, lazy evaluation
      globalThis.UnwindingStatement.push(path)
    }
  }
}

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
    const localBindingIdName: string = localBinding.identifier.name;
    const mapValue = globalThis.importedMap.get(localBindingIdName);

    if (mapValue) {
      const buildData = buildSequenceExpressionOrNot(path, localBindingIdName, globalThis)
      if (buildData) {
        const { statement, isSequenceExpression } = buildData

        if (isSequenceExpression) {
          path.parentPath.replaceWith(statement);
        } else {
          const { key } = mapValue
          // If you replace something you don't need to replace, you end up in an endless loop with ReferencedIdentifier
          if (key) path.replaceWith(statement);
        }
      }
    } else {
      // Unwind unreferenced statement at runtime
      // That is, lazy evaluation
      globalThis.UnwindingStatement.push({ path, localBindingIdName })
    }
  }
}

import { NodePath, Binding } from '@babel/traverse';
import * as t from '@babel/types';
import BaseTraverser from '../BaseTraverser';

import { GlobalThisType } from './../../types';

export default class ReferencedIdentifierTraverser extends BaseTraverser {
  private IGNORE_REFERENCED_LIST = ['require', 'module', 'exports'];
  public globalThis: GlobalThisType;
  public nodeName: string;
  public localBinding: Binding;

  constructor(path: NodePath, globalThis: GlobalThisType) {
    super(path);
    this.globalThis = globalThis;
    this.path = path;
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
    const { localName, key } = globalThis.importedMap.get(idName);

    if (key) {
      const statement = t.expressionStatement(
        t.memberExpression(t.identifier(localName), t.identifier(key), false)
      );

      path.replaceWith(statement);
    }
  }
}

import { NodePath } from '@babel/traverse';

export default class BaseTraverser {
  public path: NodePath;

  constructor(path: NodePath) {
    this.path = path;
  }

  public run() {
    this.beforeProcess();
    this.insertBefore();
    this.replaceWith();
    this.insertAfter();
  }

  public beforeProcess(): void {
    throw new Error('Please override inherit class');
  }

  public insertBefore(): void {
    throw new Error('Please override inherit class');
  }

  public replaceWith(): void {
    throw new Error('Please override inherit class');
  }

  public insertAfter(): void {
    throw new Error('Please override inherit class');
  }
}

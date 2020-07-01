import * as t from '@babel/types'
import * as builder from '../builder'
import {
  AlreadyImplementedError
} from '../errors';

// MEMO:
// binding to an instance of BabelFile
export function addUDFHelper(name: string): t.Identifier {
  let isAlreadyExist;

  /**
   * MEMO:
   * 
   * availableHelper may return an error.
   * https://github.com/babel/babel/blob/3d498d05e737b6b497df55a177c113fd8167b744/packages/babel-core/src/transformation/file/file.js#L134
   */
  try { isAlreadyExist = this.availableHelper(name, undefined) } catch (e) { throw e };
  if (isAlreadyExist) throw new AlreadyImplementedError(`${name} cannot be used because it is supported by babel official.\nPlease change the name of the helper.`);

  const declar = this.declarations[name];
  if (declar) return t.cloneNode(declar);

  // make sure that the helper exists
  // this.constructor is babel.BabelFile class
  builder.ensure(name, this.constructor)

  const uid = (this.declarations[name] = this.scope.generateUidIdentifier(name))

  const dependencies = {};
  for (const dep of builder.getDependencies(name)) {
    dependencies[dep] = this.addUDFHelper(dep);
  }

  const { nodes, globals } = builder.buildProgram({
    name,
    currentId: uid,
    currentDependencies: dependencies,
    currentLocalBindingNames: Object.keys(this.scope.getAllBindings())
  })

  // MEMO:
  // Rename if global variables overlap
  globals.forEach((name: string) => {
    if (this.path.scope.hasBinding(name, true /* noGlobals */)) {
      this.path.scope.rename(name);
    }
  })

  // MEMO:
  // babel/generator reads _compact and compacts the output
  // https://github.com/babel/babel/blob/379e1c55937231de15ca97b475942b96983aa330/packages/babel-generator/src/printer.js#L374
  nodes.forEach(name => {
    nodes._compact = true
  });

  this.path.unshiftContainer("body", nodes);
  // MEMO:
  // NodePath# is not automatically registered in bindings, so the following code is required
  this.path.get("body").forEach(path => {
    if (nodes.indexOf(path.node) === -1) return;
    if (path.isVariableDeclaration()) this.scope.registerDeclaration(path);
  });

  return uid
}

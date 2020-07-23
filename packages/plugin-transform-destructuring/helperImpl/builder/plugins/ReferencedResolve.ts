import traverse, { NodePath } from '@babel/traverse'
import HelperBuilder from '..';

// MEMO:
// Helps traversing the ReferencedIdentifier of helper code
// Be sure to return a HelperBuilder instance
export default function ReferencedResolve(builder: HelperBuilder, options?: any[]): HelperBuilder {
  const visitor: any = {
    ReferencedIdentifier(path: NodePath) {
      const { globalPath, exportedStoreNamespace: esn } = builder
      const name = path.node['name'];

      // MEMO:
      // Not methodized so that store (globals) is not bound to this
      // It doesn't make sense to not reference the same thing in all HelperBuilder instances
      // Avoid global pollution as much as possible by cutting the namespace for exportedStore
      const gpPath = globalPath.findParent(path => path.isProgram())
      const globals = gpPath.scope['globals']
      const exportedStore = globals[esn]
      const rename = exportedStore[name]

      if (rename && builder.path.scope.hasBinding(name)) {
        builder.path.scope.rename(name, rename)
        const declaration = builder.path.node['declaration']
        builder.setStatement(declaration)

        Object.entries(builder.dependencies).forEach(([name, child]: [string, HelperBuilder]) => {
          ReferencedResolve(child)
        })
      }
    }
  }

  const file = builder.file()
  traverse(file, visitor, file['scope'])
  builder.setFile(file)

  return builder
}

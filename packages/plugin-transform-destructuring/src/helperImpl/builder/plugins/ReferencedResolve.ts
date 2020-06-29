import traverse, { NodePath } from '@babel/traverse'
import HelperBuilder from '..';

// MEMO:
// Helps traversing the ReferencedIdentifier of helper code
// Be sure to return a HelperBuilder instance
export default function ReferencedResolve(builder: HelperBuilder, options?: any[]): HelperBuilder {
  const visitor: any = {
    ReferencedIdentifier(path: NodePath) {
      const { globalPath, exportedCacheNamespace: namespace } = builder
      const name = path.node['name'];
      const gpPath = globalPath.findParent(path => path.isProgram())
      const exportedCache = gpPath.scope['globals']
      const rename = exportedCache[namespace] && exportedCache[namespace][name]

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

import traverse, { NodePath } from '@babel/traverse'
import HelperBuilder from '..';
import { imported as importedCache } from '../cache';

// MEMO:
// Helps traversing the ReferencedIdentifier of helper code
// Be sure to return a HelperBuilder instance
export default function ReferencedResolve(builder: HelperBuilder, options?: any[]): HelperBuilder {
  const visitor: any = {
    ReferencedIdentifier(path: NodePath) {
      const name = path.node['name'];
      const rename = importedCache.get(name)

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

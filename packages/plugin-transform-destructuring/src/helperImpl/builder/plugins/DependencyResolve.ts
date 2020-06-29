import traverse, { NodePath } from '@babel/traverse'
import HelperBuilder from '..';

// MEMO:
// Plugin for setting dependencies and statement of HelperBuilder
// Be sure to return a HelperBuilder instance
export default function DependencyResolve(builder: HelperBuilder, options?: any[]): HelperBuilder {
  const visitor: any = {
    ImportDeclaration(path: NodePath) {
      if (
        path.node["specifiers"].length !== 1 ||
        !(path.get("specifiers.0") as NodePath).isImportDefaultSpecifier()
      ) {
        throw new Error("Helpers can only import a default value")
      }

      const helperName = path.node['source']['value']
      const { globalPath, catalog, catalogs } = builder

      if (catalogs.includes(helperName)) {
        let depBuilder = new HelperBuilder(helperName, globalPath, { catalog, catalogs })
        depBuilder = DependencyResolve(depBuilder)
        builder.setDependencies({ ...builder.dependencies, ...{ [helperName]: depBuilder } })
      }
    },
    ExportDefaultDeclaration(path: NodePath) {
      const { globalPath, helperName, exportedCacheNamespace: namespace } = builder
      const declaration = path.node['declaration'];
      const gpPath = globalPath.findParent(path => path.isProgram())

      //　Avoid global pollution as much as possible by cutting the namespace for exportedCache
      let exportedCache = gpPath.scope['globals']
      exportedCache[namespace] = exportedCache[namespace] || {}
      exportedCache = exportedCache[namespace]

      const exported = exportedCache[helperName]

      if (!exported) {
        const uidName = globalPath.scope.generateUidIdentifier(helperName).name

        if (helperName !== uidName) {
          exportedCache[helperName] = uidName
          declaration.id.name = uidName

          builder.updateHelperName(uidName)
          builder.updateCatalogAll(helperName, uidName)
        } else {
          exportedCache[helperName] = helperName
        }
      } else {
        const globalParentPath = globalPath.findParent(path => path.isProgram())
        const gpUids = globalParentPath.scope['uids'];

        // MEMO:
        // Global cache exists, but there is no cache for uids in globalPath.
        // This means traversing for entirely new content.
        // There is no problem in overwriting the cache.
        if (!gpUids[helperName]) {
          const uidName = globalPath.scope.generateUidIdentifier(helperName).name

          if (helperName !== uidName) {
            exportedCache[helperName] = uidName
            declaration.id.name = uidName

            builder.updateHelperName(uidName)
            builder.updateCatalogAll(helperName, uidName)
          } else {
            exportedCache[helperName] = helperName
          }
        }
      }

      builder.setPath(path)
      builder.setStatement(declaration)
    },
    ExportAllDeclaration(path: NodePath) {
      throw new Error("Helpers can only export default");
    },
    ExportNamedDeclaration(path: NodePath) {
      throw new Error("Helpers can only export default");
    }
  }

  const file = builder.file()
  traverse(file, visitor, file['scope'])
  builder.setFile(file)

  return builder
}

import traverse, { NodePath } from '@babel/traverse'
import HelperBuilder from '..';
import { imported as importedCache } from '../cache';

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
      const { globalPath, helperName } = builder
      const declaration = path.node['declaration'];
      const uidName = globalPath.scope.generateUidIdentifier(helperName).name
      if (helperName !== uidName) {
        importedCache.set(helperName, uidName)
        declaration.id.name = uidName
        builder.updateHelperName(uidName)
        builder.updateCatalogAll(helperName, uidName)
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

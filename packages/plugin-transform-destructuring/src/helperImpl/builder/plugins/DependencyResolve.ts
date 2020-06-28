import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types';
import HelperBuilder from '..';

// MEMO:
// Plugin for setting dependencies and statement of HelperBuilder
// Be sure to return a HelperBuilder instance
export default function DependencyResolve(builder: HelperBuilder, options?: any[]): HelperBuilder {
  const dependencyVisitor: any = {
    ImportDeclaration(path: NodePath) {
      if (
        path.node["specifiers"].length !== 1 ||
        !(path.get("specifiers.0") as NodePath).isImportDefaultSpecifier()
      ) {
        throw new Error("Helpers can only import a default value")
      }

      const helperName = path.node['source']['value']
      const { catalog, catalogs } = builder

      if (catalogs.includes(helperName)) {
        let depBuilder = new HelperBuilder(helperName, { catalog, catalogs })
        depBuilder = DependencyResolve(depBuilder)
        builder.setDependencies({ ...builder.dependencies, ...{ [helperName]: depBuilder } })
      }
    },
    ExportDefaultDeclaration(path: NodePath) {
      const declaration = path.node['declaration'];
      builder.setStatement(declaration)
    },
    ExportAllDeclaration(path: NodePath) {
      throw new Error("Helpers can only export default");
    },
    ExportNamedDeclaration(path: NodePath) {
      throw new Error("Helpers can only export default");
    }
  }

  const file = t.file(builder.program())
  traverse(file, dependencyVisitor, file['scope'])

  return builder
}

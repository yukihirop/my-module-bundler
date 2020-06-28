import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types';
import * as catalog from '../../catalog'
import HelperBuilder from '../builder';

var catalogs = Object.keys(catalog.default);

// MEMO:
// Hook for setting dependencies and statement of HelperBuilder
export default function useDependencyResolve(builder: HelperBuilder) {
  const dependencyVisitor: any = {
    ImportDeclaration(path: NodePath) {
      const helperName = path.node['source']['value']
      if (catalogs.includes(helperName)) {
        let depBuilder = new HelperBuilder(helperName)
        depBuilder = useDependencyResolve(depBuilder)
        builder.setDependencies({ ...builder.dependencies, ...{ [helperName]: depBuilder } })
      }
    },
    ExportDefaultDeclaration(path: NodePath) {
      const declaration = path.node['declaration'];
      builder.setStatement(declaration)
    }
  }

  const file = t.file(builder.program)
  traverse(file, dependencyVisitor, file['scope'])

  return builder
}

import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types';
import * as s from '../../statement'
import HelperBuilder from '../builder';

var statementNames = Object.keys(s);

export default function useDependencyResolve(builder: HelperBuilder) {
  const dependencyVisitor: any = {
    CallExpression(path: NodePath) {
      const helperName = path.node['callee']['name'];

      if (statementNames.includes(`${helperName}Statement`)) {
        let depBuilder = new HelperBuilder(helperName)
        depBuilder = useDependencyResolve(depBuilder)
        builder.dependencies = { ...builder.dependencies, ...{ [helperName]: depBuilder } }
      }
    }
  }

  const file = t.file(t.program([builder.statement]))
  traverse(file, dependencyVisitor, file['scope'])

  return builder
}

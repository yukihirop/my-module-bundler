import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TraverserThisType } from '../types';
import { buildSequenceExpressionOrNot } from './index';

type NodePathDataType = { path: NodePath; localBindingIdName: string };

export default class LazyEvaluateStatement {
  public traverserThis: TraverserThisType;
  public data: NodePathDataType[];

  constructor(traverserThis: TraverserThisType) {
    this.traverserThis = traverserThis;
    this.data = [] as NodePathDataType[];
  }

  public push(nodeData: NodePathDataType) {
    this.data.push(nodeData);
  }

  public replaceWith(): void {
    const { data, traverserThis } = this;
    data.forEach(({ path, localBindingIdName }: NodePathDataType) => {
      const buildData = buildSequenceExpressionOrNot(path, localBindingIdName, traverserThis);
      if (buildData) {
        const { statement, isSequenceExpression } = buildData;
        if (isSequenceExpression) {
          path.parentPath.replaceWith(statement);
        } else {
          path.replaceWith(statement);
        }
      }
    });
  }

  public buildStatements(): Array<t.Statement> {
    const { data, traverserThis } = this;
    let result = [] as Array<t.Statement>;
    data.forEach(({ path, localBindingIdName }: NodePathDataType) => {
      const buildData = buildSequenceExpressionOrNot(path, localBindingIdName, traverserThis);
      if (buildData) {
        const { statement, isSequenceExpression } = buildData;
        if (isSequenceExpression) {
          path.parentPath.remove();
        } else {
          const containerType = path.container['type'];
          if (containerType === 'ExpressionStatement') {
            path.remove();
          } else if (containerType === 'CallExpression') {
            path.parentPath.remove();
          }
        }
        result.push(statement);
      }
    });
    return result;
  }
}

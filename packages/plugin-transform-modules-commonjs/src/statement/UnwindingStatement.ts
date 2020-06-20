import { NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { GlobalThisType } from './../types';
import { buildSequenceExpressionOrNot } from './index';

export default class UnwindingStatement {
  public globalThis: GlobalThisType
  public data: NodePath[]

  constructor(globalThis: GlobalThisType) {
    this.globalThis = globalThis
    this.data = [] as NodePath[]
  }

  public push(path: NodePath) {
    this.data.push(path)
  }

  public buildStatements(): Array<t.Statement> {
    const { data, globalThis } = this
    let result = [] as Array<t.Statement>
    data.forEach((path: NodePath) => {
      const buildData = buildSequenceExpressionOrNot(path, globalThis)
      if (buildData) {
        const { statement, isSequenceExpression } = buildData
        if (isSequenceExpression) {
          path.parentPath.remove();
        } else {
          path.remove()
        }
        result.push(statement)
      }
    })
    return result
  }
}

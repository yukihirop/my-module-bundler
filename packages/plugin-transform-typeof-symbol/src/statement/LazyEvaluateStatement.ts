import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TraverserThisType } from '../types';

type NodePathDataType = { path: NodePath; statement: t.Statement };

export default class LazyEvaluateStatement {
  public traverserThis: TraverserThisType
  public data: NodePathDataType[]

  constructor(traverserThis: TraverserThisType) {
    this.traverserThis = traverserThis
    this.data = [] as NodePathDataType[]
  }

  public push(statementData: NodePathDataType) {
    this.data.push(statementData)
  }

  public replaceWith(): void {
    this.data.forEach(({ path, statement }: NodePathDataType) => {
      path.replaceWith(statement)
    })
  }
}

import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { TraverserThisType } from '../types';
import BuiltinGlobalObjects from '../builtin';

type NodePathDataType = { path: NodePath; statement: t.Statement };

export default class LazyEvaluateStatement {
  public traverserThis: TraverserThisType;
  public data: NodePathDataType[];

  constructor(traverserThis: TraverserThisType) {
    this.traverserThis = traverserThis;
    this.data = [] as NodePathDataType[];
  }

  public isBuiltinGlobalObject(arg: any): boolean {
    // exclude null and undefined
    const isNull = arg.type === 'NullLiteral';
    const isUndefined = arg.type === 'Identifier' && arg.name === 'undefined';
    const isBuiltinGlobalObject =
      arg.type === 'Identifier' && BuiltinGlobalObjects.includes(arg.name);
    return ![isNull, isUndefined].some(Boolean) && isBuiltinGlobalObject;
  }

  public push(statementData: NodePathDataType) {
    this.data.push(statementData);
  }

  public replaceWith(): void {
    this.data.reverse().forEach(({ path, statement }: NodePathDataType) => {
      path.replaceWith(statement);
    });
  }
}

import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ExportsVoid0Statement, LazyEvaluateStatement } from './statement';

export type BabelTypes = {
  types: typeof t;
};

export type VariableKindType = 'var' | 'const' | 'let';
export type NodeType = 'FunctionDeclaration' | 'VariableDeclaration';

export type MapValueType = {
  localName?: string;
  key?: string;
};

export type PluginOptionsType = {
  noInterop?: boolean
  loose?: boolean
}
export type GlobalThisType = {
  IsESModule: boolean;
  importedMap?: Map<string, MapValueType>;
  beforeStatements: t.Statement[];
  willRemovePaths: NodePath[];
  ExportsVoid0Statement: ExportsVoid0Statement;
  LazyEvaluateStatement: LazyEvaluateStatement;
  opts: PluginOptionsType
};

export type StatementWithConditionType = { statement: t.Statement; isSequenceExpression: boolean };

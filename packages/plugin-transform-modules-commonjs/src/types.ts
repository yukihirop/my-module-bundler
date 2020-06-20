import * as t from '@babel/types';
import { ExportsVoid0Statement, UnwindingStatement } from './statement'

export type BabelTypes = {
  types: typeof t;
};

export type VariableKindType = 'var' | 'const' | 'let';
export type NodeType = 'FunctionDeclaration' | 'VariableDeclaration';

export type MapValueType = {
  localName?: string
  key?: string
}
export type GlobalThisType = {
  IsESModule: boolean;
  importedMap?: Map<string, MapValueType>;
  beforeStatements: t.Statement[];
  ExportsVoid0Statement: ExportsVoid0Statement;
  UnwindingStatement: UnwindingStatement
};

export type StatementWithConditionType = { statement: t.Statement, isSequenceExpression: boolean }

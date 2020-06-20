import * as t from '@babel/types';
import { ExportsVoid0Statement } from './statement'

export type BabelTypes = {
  types: typeof t;
};

export type VariableKindType = 'var' | 'const' | 'let';
export type NodeType = 'FunctionDeclaration' | 'VariableDeclaration';
export type GlobalThisType = {
  IsESModule: boolean;
  importedMap?: Map<string, any>;
  beforeStatements: t.Statement[];
  ExportsVoid0Statement: ExportsVoid0Statement;
};

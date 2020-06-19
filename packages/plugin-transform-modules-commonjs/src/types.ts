import * as t from '@babel/types';

export type BabelTypes = {
  types: typeof t;
};

export type VariableKindType = 'var' | 'const' | 'let';
export type NodeType = 'FunctionDeclaration' | 'VariableDeclaration';
export type GlobalThisType = {
  IsESModule: boolean;
  importedMap?: Map<string, any>;
  beforeStatements: t.Statement[];
};

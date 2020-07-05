import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { LazyEvaluateStatement } from './statement';

export type BabelTypes = {
  types: typeof t;
};

export type TraverserThisType = babel.PluginPass & {
  beforeStatements: t.Statement[];
  LazyEvaluateStatement: LazyEvaluateStatement;
}

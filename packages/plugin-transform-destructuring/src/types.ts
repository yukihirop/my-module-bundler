import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { LazyEvaluateStatement } from './statement';

export type BabelTypes = {
  types: typeof t;
};

export type TraverserThisType = {
  beforeStatements: t.Statement[];
  LazyEvaluateStatement: LazyEvaluateStatement;
  isAddHelper?: boolean;
  _objectWithoutProprtiesFuncName?: string;
  _objectWithoutProprtiesLooseFuncName?: string;
}

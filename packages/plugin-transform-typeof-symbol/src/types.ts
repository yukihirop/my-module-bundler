import * as t from '@babel/types';
import { LazyEvaluateStatement } from './statement';

export type BabelTypes = {
  types: typeof t;
};

export type TraverserThisType = {
  isTypeof: boolean;
  typeofFuncName: string;
  LazyEvaluateStatement: LazyEvaluateStatement;
}

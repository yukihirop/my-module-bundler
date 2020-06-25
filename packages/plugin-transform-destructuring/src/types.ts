import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export type BabelTypes = {
  types: typeof t;
};

export type TraverserThisType = {
  beforeStatements: t.Statement[];
  isAddHelper?: boolean;
  _objectWithoutProprtiesFuncName?: string;
  _objectWithoutProprtiesLooseFuncName?: string;
}

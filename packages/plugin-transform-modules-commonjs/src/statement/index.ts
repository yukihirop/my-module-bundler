export * from './interop';
export * from './misc';
export * from './loose';
import ExportsVoid0Statement from './ExportsVoid0Statement';
import LazyEvaluateStatement from './LazyEvaluateStatement';
export { ExportsVoid0Statement, LazyEvaluateStatement };

import template from '@babel/template';

export const void0Statement = template.statement`void 0`();

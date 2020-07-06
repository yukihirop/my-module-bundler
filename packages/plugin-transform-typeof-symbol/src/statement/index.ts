import template from '@babel/template';
import LazyEvaluateStatement from './LazyEvaluateStatement';
export { LazyEvaluateStatement };

export const typeofforGlobalObjectStatement = (funcName: string, obj: any) =>
  template.statement`
    (typeof OBJ === "undefined" ? "undefined" : FUNC_NAME(OBJ))`({ FUNC_NAME: funcName, OBJ: obj });

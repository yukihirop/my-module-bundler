import template from '@babel/template';
import LazyEvaluateStatement from './LazyEvaluateStatement';
export { LazyEvaluateStatement };

export const COMPATIBILITY_TYPEOF = '_typeof';

export const _interopTypeofStatement = (funcName = COMPATIBILITY_TYPEOF) =>
  template.statement`
function FUNC_NAME(obj) {
  // After ES2015
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    FUNC_NAME = function FUNC_NAME(obj) {
      return typeof obj;
    };
  } else {
    FUNC_NAME = function FUNC_NAME(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return FUNC_NAME(obj);
}
`({
    FUNC_NAME: funcName,
  });

export const typeofforGlobalObjectStatement = (funcName = COMPATIBILITY_TYPEOF, obj: any) =>
  template.statement`
    (typeof OBJ === "undefined" ? "undefined" : FUNC_NAME(OBJ))`({ FUNC_NAME: funcName, OBJ: obj });

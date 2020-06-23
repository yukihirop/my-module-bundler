import template from '@babel/template';
import LazyEvaluateStatement from './LazyEvaluateStatement'
export { LazyEvaluateStatement }

export const COMPATIBILITY_TYPEOF = "_typeof"

export const _interopTypeofStatement = template.statement`
function _typeof(obj) {
  // After ES2015
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
`();

export const typeofforGlobalObjectStatement = (obj: any) => template.statement`
    (typeof OBJ === "undefined" ? "undefined" : _typeof(OBJ))`({ OBJ: obj });

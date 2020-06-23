import template from '@babel/template';

export const COMPATIBILITY_TYPEOF = "_typeof"

export const _typeofStatement = template.statement`
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
`()

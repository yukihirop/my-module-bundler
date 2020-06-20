import * as t from '@babel/types';
import template from '@babel/template';
import ExportsVoid0Statement from './ExportsVoid0Statement'
export { ExportsVoid0Statement }

export const useStrictStatement = t.expressionStatement(t.stringLiteral('use strict'));

// e.g.)
// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
export const define__esModuleStatement = t.expressionStatement(
  t.callExpression(
    t.memberExpression(t.identifier('Object'), t.identifier('defineProperty'), false),
    [
      t.identifier('exports'),
      t.stringLiteral('__esModule'),
      t.objectExpression([t.objectProperty(t.identifier('value'), t.booleanLiteral(true))]),
    ]
  )
);

// e.g.)
// exports.default = _default
// exports.a = a
export const buildExportsStatement = (
  key = 'default',
  localName = '_default'
): t.ExpressionStatement =>
  t.expressionStatement(
    template.expression`exports.KEY = LOCAL_NAME`({ KEY: key, LOCAL_NAME: localName })
  );

// e.g.)
// Copy the imported module to its internal attributes and set it to exports
// Object.keys(_foo).forEach(function (key) {
//   if (key === "default" || key === "__esModule") return;
//   Object.defineProperty(exports, key, {
//     enumerable: true,
//     get: function get() {
//       return _foo[key];
//     }
//   });
// });
export const buildDefinePropertyExportsStatement = (moduleName: string) => {
  // __esModule is not listed in Object.keys, so it should be possible to exclude it from the judgment conditions
  return template.statement`
    Object.keys(MODULE_NAME).forEach(function(key){
      if(key === "default" || key === "__esModule") return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function (){
          return MODULE_NAME[key]
        }
      })
    })
  `({
    MODULE_NAME: `_${moduleName}`,
  });
};

// e.g.)
//
// Object.defineProperty(exports, "bar", {
//   enumerable: true,
//   get: function () {
//     return _foo.bar;
//   }
// });
export const buildDefinePropertyExportNamedStatement = (
  moduleName: string,
  exportedName: string,
  localName?: string
): t.ExpressionStatement => {
  localName = localName ? localName : exportedName;
  const expression = template.expression`
    Object.defineProperty(exports, "EXPORTED_NAME", {
      enumerable: true,
      get: function() {
        return MODULE_NAME.LOCALE_NAME
      }
    })`({
    MODULE_NAME: `_${moduleName}`,
    EXPORTED_NAME: exportedName,
    LOCALE_NAME: localName,
  });

  return t.expressionStatement(expression);
};

export const buildRequireStatement = (
  moduleName: string,
  sourceName: string,
  requireType = 'require'
) => {
  let statement;
  switch (requireType) {
    case 'require':
      statement = buildNodeRequireStatement(sourceName, moduleName);
      break;
    case '_interopRequireDefault':
      statement = build_InteropRequireDefaultStatement(moduleName, sourceName);
      break;
    case '_interopRequireWildcard':
      statement = build_InteropRequireWildcardStatement(moduleName, sourceName);
      break;
    default:
      statement = buildNodeRequireStatement(sourceName, moduleName);
      break;
  }
  return statement;
};

// e.g.)
// var _a = require("./a.js");
export const buildNodeRequireStatement = (sourceName: string, moduleName?: string) => {
  return moduleName
    ? template.statement`
      var VARIABLE_NAME = require("SOURCE_NAME");
    `({
        VARIABLE_NAME: `_${moduleName}`,
        SOURCE_NAME: sourceName,
      })
    : template.statement`
      require("SOURCE_NAME");
    `({
        SOURCE_NAME: sourceName,
      });
};

// e.g.)
// var _a = _interopRequireDefault(require("./a.js"))
export const build_InteropRequireDefaultStatement = (moduleName: string, sourceName: string) => {
  return template.statement`
    var VARIABLE_NAME = _interopRequireDefault(require("SOURCE_NAME"))
  `({
    VARIABLE_NAME: `_${moduleName}`,
    SOURCE_NAME: sourceName,
  });
};

// e.g.)
// var b = _interopRequireWildcard(require("./a.js"))
export const build_InteropRequireWildcardStatement = (localName: string, sourceName: string) => {
  return template.statement`
    var VARIABLE_NAME = _interopRequireWildcard(require("SOURCE_NAME"))
  `({
    VARIABLE_NAME: localName,
    SOURCE_NAME: sourceName,
  });
};

export const _interopRequireDefault = template.statement`
    function _interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj}; }
  `();

// e.g.)
// function _interopRequireWildcard(obj) {
//   if (obj && obj.__esModule) { return obj; }
//   if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; }
//   var cache = _getRequireWildcardCache();
//   if (cache && cache.has(obj)) {
//     return cache.get(obj);
//   }

//   var newObj = {};
//   var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
//   for (var key in obj) {
//     if (Object.prototype.hasOwnProperty.call(obj, key)) {
//       var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
//       if (desc && (desc.get || desc.set)) {
//         Object.defineProperty(newObj, key, desc);
//       } else {
//         newObj[key] = obj[key];
//       }
//     }
//   }
//   newObj.default = obj;
//   if (cache) {
//     cache.set(obj, newObj);
//   }
//   return newObj;
// }
export const _interopRequireWildcard = template.statement`
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) { return obj; }
  if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
`();

// e.g.)
// function _getRequireWildcardCache() {
//   if (typeof WeakMap !== "function") return null;
//   var cache = new WeakMap();
//   _getRequireWildcardCache = function () {
//     return cache;
//   };
//   return cache;
// }
export const _getRequireWildcardCache = template.statement`
function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function () {
    return cache;
  };
  return cache;
}
`();

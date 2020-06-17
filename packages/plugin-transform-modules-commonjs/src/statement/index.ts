import * as t from '@babel/types';
import template from '@babel/template';
import { basename } from 'path';

export const useStrictStatement = t.expressionStatement(
  t.stringLiteral("use strict")
)

// e.g.)
// Object.defineProperty(exports, "__esModule", {
//   value: true
// });
export const define__esModuleStatement = t.expressionStatement(
  t.callExpression(
    t.memberExpression(
      t.identifier("Object"),
      t.identifier("defineProperty"),
      false
    ),
    [
      t.identifier("exports"),
      t.stringLiteral("__esModule"),
      t.objectExpression(
        [
          t.objectProperty(t.identifier("value"), t.booleanLiteral(true))
        ]
      )
    ]
  )
)

// e.g.)
// exports.default = void 0
//
// Since "undefined" is a value that can be overwritten, void 0 is used
export const exportsDefaultVoid0Statement = t.expressionStatement(
  t.assignmentExpression(
    "=",
    t.memberExpression(
      t.identifier("exports"),
      t.identifier("default"),
      false
    ),
    t.unaryExpression(
      "void",
      t.numericLiteral(0)
    )
  )
)
// e.g.)
// exports.default = _default
export const exportsDefaultStatement = (name = "_default") => t.expressionStatement(
  t.assignmentExpression(
    "=",
    t.memberExpression(
      t.identifier("exports"),
      t.identifier("deafult"),
      false
    ),
    t.identifier(name)
  )
)

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
    MODULE_NAME: `_${moduleName}`
  })
}

// e.g.)
//
// Object.defineProperty(exports, "bar", {
//   enumerable: true,
//   get: function () {
//     return _foo.bar;
//   }
// });
export const buildDefinePropertyExportNamedStatement = (moduleName: string, exportedName: string, localName?: string) => {
  localName = localName ? localName : exportedName;
  
  return template.statement`
    Object.defineProperty(exports, "EXPORTED_NAME", {
      enumerable: true,
      get: function() {
        return MODULE_NAME.LOCALE_NAME
      }
    });
  `({
    MODULE_NAME: `_${moduleName}`,
    EXPORTED_NAME: exportedName,
    LOCALE_NAME: localName,
  })
}

export const buildRequireStatement = (moduleName: string, sourceName: string, requireType = 'require') => {
  let statement;
  switch (requireType) {
    case 'require':
      statement = buildNodeRequireStatement(moduleName, sourceName)
      break;
    case '_interopRequireDefault':
      statement = build_InteropRequireDefaultStatement(moduleName, sourceName)
      break;
    default:
      statement = buildNodeRequireStatement(moduleName, sourceName)
      break;
  }
  return statement
}

// e.g.)
// var _a = require("./a.js");
export const buildNodeRequireStatement = (moduleName: string, sourceName: string) => {
  return template.statement`
    var VARIABLE_NAME = require("SOURCE_NAME");
  `({
    VARIABLE_NAME: `_${moduleName}`,
    SOURCE_NAME: sourceName
  })
}

// e.g.)
// var _a = _interopRequireDefault(require("./a.js"))
export const build_InteropRequireDefaultStatement = (moduleName: string, sourceName) => {
  return template.statement`
    var VARIABLE_NAME = _interopRequireDefault(require("SOURCE_NAME"))
  `({
    VARIABLE_NAME: `_${moduleName}`,
    SOURCE_NAME: sourceName
  })
}

export const _interopRequireDefault =
  template.statement`
    function _interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj}; }
  `()

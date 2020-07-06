import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import template from '@babel/template';
import { TraverserThisType, StatementWithConditionType } from './../types';

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
  requireType = 'require',
  rename = false
) => {
  let statement;
  switch (requireType) {
    case 'require':
      statement = buildNodeRequireStatement({ sourceName, moduleName, rename });
      break;
    case '_interopRequireDefault':
      statement = build_InteropRequireDefaultStatement(moduleName, sourceName);
      break;
    case '_interopRequireWildcard':
      statement = build_InteropRequireWildcardStatement(moduleName, sourceName);
      break;
    default:
      statement = buildNodeRequireStatement({ sourceName, moduleName, rename });
      break;
  }
  return statement;
};

// e.g.)
// var _a = require("./a.js");
export const buildNodeRequireStatement = ({
  sourceName,
  moduleName,
  rename,
}: {
  sourceName: string;
  moduleName?: string;
  rename: boolean;
}) => {
  return moduleName
    ? template.statement`
      var VARIABLE_NAME = require("SOURCE_NAME");
    `({
        VARIABLE_NAME: rename ? `_${moduleName}` : moduleName,
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
    var VARIABLE_NAME = _udf_interopRequireDefault(require("SOURCE_NAME"))
  `({
    VARIABLE_NAME: `_${moduleName}`,
    SOURCE_NAME: sourceName,
  });
};

// e.g.)
// var b = _interopRequireWildcard(require("./a.js"))
export const build_InteropRequireWildcardStatement = (localName: string, sourceName: string) => {
  return template.statement`
    var VARIABLE_NAME = _udf_interopRequireWildcard(require("SOURCE_NAME"))
  `({
    VARIABLE_NAME: localName,
    SOURCE_NAME: sourceName,
  });
};

export const buildSequenceExpressionOrNot = (
  path: NodePath,
  localBindingIdName: string,
  traverserThis: TraverserThisType
): StatementWithConditionType | null => {
  const mapValue = traverserThis.importedMap.get(localBindingIdName);
  let statement;

  if (mapValue) {
    const { localName, key } = mapValue;
    const args = path.parent['arguments'];

    // e.g.)
    // For unbind this, Convert from _a.b(args) to (0, _a.b)(args) because _a.b is global variable.
    if (key) {
      if (args !== undefined) {
        statement = t.expressionStatement(
          t.callExpression(
            t.sequenceExpression([
              t.numericLiteral(0),
              t.memberExpression(t.identifier(localName), t.identifier(key), false),
            ]),
            args
          )
        );
        return { statement, isSequenceExpression: true };
      } else {
        statement = t.expressionStatement(
          t.memberExpression(t.identifier(localName), t.identifier(key), false)
        );
        return { statement, isSequenceExpression: false };
      }
      // e.g.)
      // when 「import * as b from './a.js'」
      // b => b
      // b(n) => b(n)
    } else {
      // b(n) => b(n)
      if (args !== undefined) {
        statement = t.expressionStatement(t.callExpression(t.identifier(localName), args));
        // b => b
      } else {
        statement = t.expressionStatement(t.identifier(localName));
      }
      return { statement, isSequenceExpression: false };
    }
  } else {
    return null;
  }
};

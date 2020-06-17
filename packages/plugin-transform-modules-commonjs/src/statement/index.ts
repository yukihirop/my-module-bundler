import * as t from '@babel/types';
import template from '@babel/template';

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
  return template.statement`
    Object.keys(MODULE_NAME).forEach(function(key){
      if(key === "default" || key === "__esModule") return;
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get(){
          return MODULE_NAME[key]
        }
      })
    })
  `({
    MODULE_NAME: `_${moduleName}`
  })
}

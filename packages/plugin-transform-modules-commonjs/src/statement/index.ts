import * as t from '@babel/types';

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

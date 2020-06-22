// Function Declaration should be hoisted
export function hoist() {
  return null
}

// Function Expression is not hoisted
export var not_hoist_1 = function not_hoist_1() {
  return null
}

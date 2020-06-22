hoist()

export function hoist() {
  return null
}

export var not_hoist_1 = function not_hoist_1() {
  not_hoist_2()
}

// Error
not_hoist_1()

export var not_hoist_2 = function not_hoist_2() {
  return null
}

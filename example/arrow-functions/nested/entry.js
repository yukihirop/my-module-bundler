var arr = [[1, 2],[3, 4]]
var result = arr.map((x, y) => {
  var r = x.map((u, t) => {
    return u * u
  })
  return r
})
console.log(result)

const { default: lib } = require("babel-preset-env");

module.exports = {
  include: ["src"],
  compilerOptions: {
    outDir: "lib",
    rootDir: "src",
    declaration: true,
    module: "esnext"
  }
}

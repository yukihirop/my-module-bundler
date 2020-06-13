'use strict';

const fs = require('fs'),
  path = require('path'),
  babylon = require('babylon'),
  traverse = require('babel-traverse').default,
  { transformFromAst } = require('babel-core'),
  { mainTemplate, moduleTemlate } = require('./template'),
  { js: beautify } = require('js-beautify'),
  env = require('babel-preset-env');

let moduleID = 0;

/**
 * We create a function that will accept a path to a file, read
 * it's contents, and extract its dependencies.
 *
 * @param {string} filename - File name
 * @return {Object} result - Asset Object
 * @return {number} result.id - module ID
 * @return {string} result.filename - File name
 * @return {array} result.dependencies - This array will hold the relative paths of modules this module depends on.
 * @reutrn {Object} result.code - code transform from Ast
 * @access private
 *
 */
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast = babylon.parse(content, {
    sourceType: 'module',
  });

  // This array will hold the relative paths of modules this module depends on.
  const dependencies = [];

  traverse(ast, {
    ImportDeclaration({ node }) {
      // Every time we see an import into the dependencies array.
      dependencies.push(node.source.value);
    },
  });

  // We also assign a unique identifier to this module by incrementing a simple counter.
  const id = moduleID++;

  const { code } = transformFromAst(ast, null, {
    presets: [env],
  });

  return {
    id,
    filename,
    dependencies,
    code,
  };
}

/**
 * Extract the dependencies of the entry file
 *
 * @param {string} entry - Entry file
 * @return {array} result - Array of asset
 * @access private
 */
function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];

  for (const asset of queue) {
    // assets has alist of relative paths to he modules it depends on.
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);

    asset.dependencies.forEach((relativePath) => {
      const absolutePath = path.join(dirname, relativePath);
      // Parse the asset, read its content, and extract its dependencies.
      const child = createAsset(absolutePath);
      // It's essential for us to know `asset` depends on `child`
      asset.mapping[relativePath] = child.id;

      queue.push(child);
    });
  }

  return queue;
}

/**
 * Define a function that will use our graph and return a bundle that
 * We can run in the browser
 *
 * Our bundle will have just one self-invoking function:
 *
 * (function(){})()
 * @param {array} graph - Array of asset
 * @access private
 */
function bundle(graph) {
  let modules = [];

  // Add a string of this format: `key: value,`.
  graph.forEach((mod) => {
    modules.push(moduleTemlate(mod));
  });

  // Finaly, we implement the body of the self-invoking function (IFEE)
  return mainTemplate(modules);
}

/**
 *
 * @param {string} input - input file path
 * @param {string} output - output file path
 */
async function bundler({ input, output }) {
  const graph = createGraph(input),
    result = bundle(graph),
    formatted = beautify(result, {
      indent_size: 2,
      space_in_empty_paren: true,
    });

  await fs.promises.writeFile(output, formatted);
}

module.exports = bundler;

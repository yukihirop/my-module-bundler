'use strict';

import fs from 'fs';
import path from 'path';
import * as babylon from 'babylon';
import { default as traverse } from '@babel/traverse';
import { transformFromAstSync } from '@babel/core';
import { mainTemplate, moduleTemlate } from './template';
import { js as beautify } from 'js-beautify';
// TypeError: unknown: Cannot read property 'bindings' of null
// https://stackoverflow.com/questions/52092739/upgrade-to-babel-7-cannot-read-property-bindings-of-null
import env from '@babel/preset-env';
import { Asset, Graph, BundlerParams } from './types';
import transformArrowFunctions from '@yukihirop/plugin-transform-arrow-functions';
import transformModulesCommonjs from '@yukihirop/plugin-transform-modules-commonjs';

// TODO: Use Class

let moduleID = 0;

/**
 * We create a function that will accept a path to a file, read
 * it's contents, and extract its dependencies.
 * @access private
 *
 */
function createAsset(filename: string): Asset {
  const content = fs.readFileSync(filename, 'utf-8');
  const ast: any = babylon.parse(content, {
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

  const { code } = transformFromAstSync(ast, null, {
    plugins: [
      transformArrowFunctions,
      transformModulesCommonjs
    ],
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
 * @access private
 */
function createGraph(entry: string): Graph {
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
 * @access private
 */
function bundle(graph: Graph): string {
  let modules = [];

  // Add a string of this format: `key: value,`.
  graph.forEach((mod) => {
    modules.push(moduleTemlate(mod));
  });

  // Finaly, we implement the body of the self-invoking function (IFEE)
  return mainTemplate(modules);
}

async function bundler({ input, output }: BundlerParams) {
  const graph = createGraph(input),
    result = bundle(graph),
    formatted = beautify(result, {
      indent_size: 2,
      space_in_empty_paren: true,
    });

  //　Initialize the globally defined moduleID
  moduleID = 0;
  await fs.promises.writeFile(output, formatted);
}

export default bundler;

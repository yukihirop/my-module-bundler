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
import { AssetType, GraphType, WriteParamsType, OptionsType } from './types';

// TODO: Use Class
class Bunlder {
  public moduleId: number;
  public options: OptionsType;

  constructor(options: OptionsType) {
    this.moduleId = 0;
    this.options = options
  }

  /**
   * We create a function that will accept a path to a file, read
   * it's contents, and extract its dependencies.
   *
   */
  private createAsset(filename: string): AssetType {
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
      ExportAllDeclaration({ node }) {
        // Every time we see an import into the dependencies array.
        dependencies.push(node.source.value);
      },
      ExportNamedDeclaration({ node }) {
        // Every time we see an import into the dependencies array.
        if (node.source) {
          dependencies.push(node.source.value);
        }
      },
    });

    // We also assign a unique identifier to this module by incrementing a simple counter.
    const id = this.moduleId++;

    const { code } = transformFromAstSync(ast, null, this.options);

    return {
      id,
      filename,
      dependencies,
      code,
    };
  }

  /**
   * Extract the dependencies of the entry file
   */
  private createGraph(entry: string): GraphType {
    const mainAsset = this.createAsset(entry);
    const queue = [mainAsset];

    for (const asset of queue) {
      // assets has alist of relative paths to he modules it depends on.
      asset.mapping = {};
      const dirname = path.dirname(asset.filename);

      asset.dependencies.forEach((relativePath) => {
        const absolutePath = path.join(dirname, relativePath);
        // Parse the asset, read its content, and extract its dependencies.
        const child = this.createAsset(absolutePath);
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
  private bundle(graph: GraphType): string {
    let modules = [];

    // Add a string of this format: `key: value,`.
    graph.forEach((mod) => {
      modules.push(moduleTemlate(mod));
    });

    // Finaly, we implement the body of the self-invoking function (IFEE)
    return mainTemplate(modules);
  }

  public async write({ input, output }: WriteParamsType) {
    const graph = this.createGraph(input),
      result = this.bundle(graph),
      formatted = beautify(result, {
        indent_size: 2,
        space_in_empty_paren: true,
      });

    await fs.promises.writeFile(output, formatted);
  }
}

export default Bunlder;

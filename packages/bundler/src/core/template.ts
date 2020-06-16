'use strict';

import { Asset, Modules } from './types';

/**
 * IFEE
 */
function mainTemplate(modules: Modules): string {
  return `
  (function(modules) {
    function require(id) {
      const [fn, mapping] = modules[id];

      function localRequire(name) {
        return require(mapping[name]);
      }

      const module = { exports: {} };

      fn(localRequire, module, module.exports);

      return module.exports;
    }

    require(0)
  })({${modules.join(',')}})
  `;
}

function moduleTemlate(asset: Asset): string {
  return `
  ${asset.id}: [
    function (require, module, exports) {
      ${asset.code}
    },
    ${JSON.stringify(asset.mapping!)},
  ]
  `;
}

export { mainTemplate, moduleTemlate };

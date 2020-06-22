'use strict';

import { AssetType, ModulesType } from './types';

/**
 * IFEE
 */
function mainTemplate(modules: ModulesType): string {
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

function moduleTemlate(asset: AssetType): string {
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

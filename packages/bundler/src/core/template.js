'use strict';

/**
 * IFEE
 *
 * @param {array} modules - Array of moduleTemplate
 */
function mainTemplate(modules) {
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

/**
 * @param {Object} mod - module
 * @return {string} result - module template
 */
function moduleTemlate(mod) {
  return `
  ${mod.id}: [
    function (require, module, exports) {
      ${mod.code}
    },
    ${JSON.stringify(mod.mapping)},
  ]
  `;
}

module.exports = {
  mainTemplate,
  moduleTemlate,
};

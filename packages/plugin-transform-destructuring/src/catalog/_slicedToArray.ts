import template from '@babel/template';
import * as t from '@babel/types';

const helpers = Object.create(null);
export default helpers;

const helper = tpl => ({
  ast: (): t.Program => template.program.ast(tpl)
})

helpers._slicedToArray = helper`
  import _arrayWithHoles from '_arrayWithHoles';
  import _iterableToArrayLimit from '_iterableToArrayLimit';
  import _unsupportedIterableToArray from '_unsupportedIterableToArray';

  export default function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i);
  }
`;

// helpers._nonIterableRest = helper`
//   export default function _nonIterableRest() { 
//     throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
//   }
// `;

helpers._unsupportedIterableToArray = helper`
  import _arrayLikeToArray from '_arrayLikeToArray'

  export default function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
`;

helpers._arrayLikeToArray = helper`
  export default function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    } 
    return arr2;
  }
`;

helpers._iterableToArrayLimit = helper`
  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      } 
    } catch (err) {
      _d = true; _e = err;
    } finally { 
      try { 
        if (!_n && _i["return"] != null) _i["return"]();
      } finally { 
        if (_d) throw _e; 
      } 
    } 
    return _arr; 
  }
`;

helpers._arrayWithHoles = helper`
  export default function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
`;

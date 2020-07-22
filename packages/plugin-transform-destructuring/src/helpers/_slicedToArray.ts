import { helper } from 'babel-udf-helpers'

const helpers = Object.create(null);
export default helpers;

helpers.udf_slicedToArray = helper`
  import udf_arrayWithHoles from 'udf_arrayWithHoles';
  import udf_iterableToArrayLimit from 'udf_iterableToArrayLimit';
  import udf_unsupportedIterableToArray from 'udf_unsupportedIterableToArray';
  import udf_nonIterableRest from 'udf_nonIterableRest';

  export default function _udf_slicedToArray(arr, i) {
    return udf_arrayWithHoles(arr) || udf_iterableToArrayLimit(arr, i) || udf_unsupportedIterableToArray(arr, i) || udf_nonIterableRest();
  }
`;

helpers.udf_nonIterableRest = helper`
  export default function _udf_nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  } 
`;

helpers.udf_unsupportedIterableToArray = helper`
  import udf_arrayLikeToArray from 'udf_arrayLikeToArray'

  export default function _udf_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return udf_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return udf_arrayLikeToArray(o, minLen);
  }
`;

helpers.udf_arrayLikeToArray = helper`
  export default function _udf_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    } 
    return arr2;
  }
`;

helpers.udf_iterableToArrayLimit = helper`
  export default function _udf_iterableToArrayLimit(arr, i) {
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

helpers.udf_arrayWithHoles = helper`
  export default function _udf_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
`;

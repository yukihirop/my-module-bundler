import { helper } from 'babel-udf-helpers';

const helpers = Object.create(null);
export default helpers;

helpers.udf_toArray = helper`
  import udf_arrayWithHoles from 'udf_arrayWithHoles'
  import udf_iterableToArray from 'udf_iterableToArray'
  import udf_unsupportedIterableToArray from 'udf_unsupportedIterableToArray'
  import udf_nonIterableRest from 'udf_nonIterableRest'

  export default function _udf_toArray(arr) {
    return udf_arrayWithHoles(arr) || udf_iterableToArray(arr) || udf_unsupportedIterableToArray(arr) || udf_nonIterableRest();
  }
`;

helpers.udf_arrayWithHoles = helper`
  export default function _udf_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
`;

helpers.udf_iterableToArray = helper`
  export default function _udf_iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

helpers.udf_nonIterableRest = helper`
  export default function _udf_nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  } 
`;

import { helper } from '..'

const helpers = Object.create(null);
export default helpers

helpers._toArray = helper`
  import _arrayWithHoles from '_arrayWithHoles'
  import _iterableToArray from '_iterableToArray'
  import _unsupportedIterableToArray from '_unsupportedIterableToArray'
  import _nonIterableRest from '_nonIterableRest'

  export default function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }
`;

helpers._arrayWithHoles = helper`
  export default function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
`;

helpers._iterableToArray = helper`
  export default function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }
`

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

helpers._nonIterableRest = helper`
  export default function _nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  } 
`;

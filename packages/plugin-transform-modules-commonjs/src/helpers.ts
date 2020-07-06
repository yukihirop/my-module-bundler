import { helper } from 'babel-udf-helpers'

const helpers = Object.create(null);
export default helpers;

helpers.udf_interopRequireDefault = helper`
  export default function _udf_interopRequireDefault(obj){ return obj && obj.__esModule ? obj : { default: obj}; }
`;

helpers.udf_interopRequireWildcard = helper`
  import udf_getRequireWildcardCache from 'udf_getRequireWildcardCache'
  
  export default function _udf_interopRequireWildcard(obj) {
    if (obj && obj.__esModule) { return obj; }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; }
    var cache = udf_getRequireWildcardCache();
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
  
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj.default = obj;
    if (cache) {
      cache.set(obj, newObj);
    }
    return newObj;
  }
`;

helpers.udf_getRequireWildcardCache = helper`
  export default function _udf_getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    _udf_getRequireWildcardCache = function () {
      return cache;
    };
    return cache;
  }
`;

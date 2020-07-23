import { helper } from 'babel-udf-helpers';

const helpers = Object.create(null);
export default helpers;

helpers.udf_objectWithoutProperties = helper`
  import udf_objectWithoutPropertiesLoose from 'udf_objectWithoutPropertiesLoose';

  export default function _udf_objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = udf_objectWithoutPropertiesLoose(source, excluded);
    var key,i;
    if (Object.getOwnPropertySymbols){
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for(i = 0; i < sourceSymbolKeys.length; i++){
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyEnumerable.call(source,key)) continue;
        target[key] = source[key];
      }
    }
    return target
  }
`;

helpers.udf_objectWithoutPropertiesLoose = helper`
  export default function _udf_objectWithoutPropertiesLoose(source, excluded){
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key,i;
    for (i = 0; i < sourceKeys.length; i++){
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
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

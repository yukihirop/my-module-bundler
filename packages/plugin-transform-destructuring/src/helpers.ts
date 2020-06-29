import { helper } from './helperImpl2'

const helpers = Object.create(null);
export default helpers

helpers.objectWithoutProperties = helper`
  import objectWithoutPropertiesLoose from "objectWithoutPropertiesLoose";

  export default function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = objectWithoutPropertiesLoose(source, excluded);
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

helpers.objectWithoutPropertiesLoose = helper`
  export default function _objectWithoutPropertiesLoose(source, excluded){
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

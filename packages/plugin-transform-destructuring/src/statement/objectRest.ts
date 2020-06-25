import { NodePath } from '@babel/traverse';
import template from '@babel/template';

export const OBJECT_WITHOUT_PROPERTIES = "_objectWithoutProperties"
export const OBJECT_WITHOUT_PROPERTIES_LOOSE = "_objectWithoutPropertiesLoose"

export const _objectWithoutPropertiesStatement = (funcName: string, funcNameLoose: string) => template.statement`
  function FUNC_NAME(source, excluded) {
    if (source == null) return {};
    var target = FUNC_NAME_LOOSE(source, excluded);
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
`({
  FUNC_NAME: funcName,
  FUNC_NAME_LOOSE: funcNameLoose
});

export const _objectWithoutPropertiesLooseStatement = (funcName: string) => template.statement`
  function FUNC_NAME(source, excluded){
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
`({
  FUNC_NAME: funcName
});

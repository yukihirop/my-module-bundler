import { helper } from 'babel-udf-helpers';

const helpers = Object.create(null);
export default helpers;

helpers.udf_typeof = helper`
  export default function _udf_typeof(obj){
    "babel-udf-helpers - udf_typeof";
    
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol"){
      _udf_typeof = function (obj) { return typeof obj; }
    } else {
      _udf_typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype
          ? "symbol"
          : typeof obj;
      }
    }
    
    return _udf_typeof(obj);
  }
`;

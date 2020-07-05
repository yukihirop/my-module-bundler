import toArray from './_toArray';
import slicedToArray from './_slicedToArray';
import objectWithoutProperties from './_objectWithoutProperties'
export default {
  ...toArray,
  ...slicedToArray,
  ...objectWithoutProperties
}

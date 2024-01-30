import { cloneDeep } from 'lodash-es';
//複製陣列(深拷貝)
export function copyArray(array) {
  return cloneDeep(array);
}
//複製object(深拷貝)
export function copyObject(object) {
  return cloneDeep(object);
}

import { isNull, isArray, isObject, isDef } from '/@/utils/is';

//組合成網址query
export const parameters = (data: any) => {
  if (!data) return '';

  const keys = Object.keys(data);

  const strArray: any = [];
  let parameters = ''; //單選
  let mutilParameters = ''; //複選格式：team=1&team=2
  if (keys.length > 0) {
    const model = {};
    keys.forEach((key) => {
      const value = data[key];

      if (isArray(value)) {
        //複選
        value.forEach((element) => {
          isObject(element)
            ? strArray.push(`${key}=${element.value}`)
            : strArray.push(`${key}=${element}`);
        });
        isArray(strArray) ? (mutilParameters = strArray.join('&')) : (mutilParameters = strArray);
      } else {
        //單選
        if (!isNull(value) && isDef(value) && value !== '') {
          model[key] = isObject(value) ? value.value : value;
        }
      }
    });
    parameters = new URLSearchParams(model).toString();
  }

  if (mutilParameters) {
    return parameters + '&' + mutilParameters;
  } else {
    return parameters;
  }
};

// 組合參數
export const combinationParams = (params: any) => {
  let stringfieldObj = '';
  if (params) {
    stringfieldObj = Object.entries(params)
      .map((x) => x.join('='))
      .join('&');
  }
  return stringfieldObj;
};

// 篩選器整理參數
//---*刪除data裡的null
export const deleteNullInParams = (params) => {
  Object.keys(params).forEach((item) => {
    if (isNull(params[item])) {
      delete params[item];
    }
  });
};

// 將參數中的特殊字形轉為字串 ; / ? : @ & = + $ ,- _ . ! ~ * ' ( ) #
export const transformToString = (params: object[] | string[]) => {
  let res = '';
  if (params) {
    const array = Object.entries(params);
    res = array.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  }

  return res;
};

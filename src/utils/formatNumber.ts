/**
 *
 */
import XEUtils from 'xe-utils'; //函式庫文件：https://x-extends.gitee.io/xe-utils/#/
//四捨五入
export function roundTo(num, decimal) {
  return Math.round((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

//無條件進位
export function roundUp(num, decimal) {
  return Math.ceil((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

//無條件捨去
export function roundDown(num, decimal) {
  return Math.floor((num + Number.EPSILON) * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

//數字加上逗號
export function numberFormatter(newValue: number) {
  return newValue
    .toString()
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
//數字加上逗號&加小數點(digits:幾位小數點)
export function getAmountFormat(num: any, digits: any) {
  if (XEUtils.isFloat(num)) {
    //顯示小數點
    return XEUtils.commafy(num, { digits: digits });
  } else {
    //顯示整數
    return XEUtils.commafy(num, { digits: 0 });
  }
}

//貨幣
export function currencyFormatter(number: number, type: number | string) {
  switch (type) {
    case '':
    case 0:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(number);
    case 'USD':
    case 1:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(number);
    case 'TWD':
    case 2:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0,
      }).format(number);
    case 'PHP':
    case 3:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
      }).format(number);
    case 'VND':
    case 4:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(number);
    case 'RMB':
    case 5:
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'RMB',
        minimumFractionDigits: 0,
      }).format(number);
  }
}
//顯示貨幣文字
export function currencyText(type: number | string) {
  switch (type) {
    case 1:
    case '1':
      return 'USD';
    case 2:
    case '2':
      return 'TWD';
    case 3:
    case '3':
      return 'PHP';
    case 4:
    case '4':
      return 'VND';
    case 5:
    case '5':
      return 'RMB';
    default:
      return 'USD';
  }
}

//計算百分比
export function getPercent(num: number, total: number) {
  if (num == 0 || total == 0) {
    return 0;
  }
  return Math.round((num / total) * 10000) / 100.0; // 小數點後兩位
}

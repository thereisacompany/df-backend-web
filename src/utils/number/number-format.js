export function formatThousandthNumber(val) {
  if (typeof val == 'undefined') return;
  val = val.toString().replace(/\,/g, '');
  var aIntNum = val.toString().split('.');
  if (aIntNum[0].length >= 4) {
    aIntNum[0] = aIntNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  if (aIntNum[1] && aIntNum[1] >= 4) {
    aIntNum[1] = aIntNum[1] ? aIntNum[1].replace(/\B(?=(\d{3})+(?!\d))/g, '') : '';
  }
  return aIntNum.join('.');
}

export function HighChartAxisUnit(unit) {
  if (Math.abs(unit) >= 1000000000000) return unit / 1000000000000 + '兆';
  else if (Math.abs(unit) >= 100000000) return unit / 100000000 + '億';
  else if (Math.abs(unit) >= 10000) return unit / 10000 + '萬';
  else return unit;
}

export function formatNumber(value) {
  //數字千分位
  value += '';
  let arr = value.split('.');
  let re = /(\d{1,3})(?=(\d{3})+$)/g;
  return arr[0].replace(re, '$1,') + (arr.length == 2 ? '.' + arr[1] : '');
}
export function roundDecimal(val, precision = 2) {
  //帶小數的四捨五入
  return (
    Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
    Math.pow(10, precision || 0)
  );
}

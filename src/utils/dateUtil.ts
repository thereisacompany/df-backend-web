/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_TIME_FORMAT2 = 'YYYY-MM-DD-HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export function formatToDateTime(date: dayjs.Dayjs | number, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date: dayjs.Dayjs | number, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDateTimewithoutSpace(
  date: dayjs.Dayjs | number,
  format = DATE_TIME_FORMAT2,
): string {
  return dayjs(date).format(format);
}

//計算天數
export function DateDiff_withoutABS(date1, date2): number {
  // date1 和 date2 是 2016-06-18 格式
  let strDate;

  strDate = date1.split('-');
  const oDate1: any = new Date(strDate[1] + '/' + strDate[2] + '/' + strDate[0]);
  strDate = date2.split('-');
  const oDate2: any = new Date(strDate[1] + '/' + strDate[2] + '/' + strDate[0]);
  const result = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒數轉換為天數(無絕對值)
  return result;
}
export function DateDiff(date1, date2): number {
  // date1 和 date2 是 2016-06-18 格式
  let strDate;

  strDate = date1.split('-');
  const oDate1: any = new Date(strDate[1] + '/' + strDate[2] + '/' + strDate[0]);
  strDate = date2.split('-');
  const oDate2: any = new Date(strDate[1] + '/' + strDate[2] + '/' + strDate[0]);
  const result = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒數轉換為天數(絕對值)

  return result;
}

export const dateUtil = dayjs;

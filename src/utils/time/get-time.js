import { formatDate } from '/@/utils/time/time-format';
import moment from 'moment';

//用今天時間算出本週、上週、本季、上季...時間
export function getDate(today) {
  let yesterday = formatDate(moment(today).subtract('1', 'day').format('YYYY-MM-DD'));
  let thisWeekStart = formatDate(moment(today).startOf('week'));
  let thisWeekEnd = formatDate(moment(today).endOf('week'));
  let lastWeekStart = formatDate(moment(today).subtract(1, 'week').startOf('week'));
  let lastWeekEnd = formatDate(moment(today).subtract(1, 'week').endOf('week'));
  let thisSeasonStart = formatDate(moment(today).startOf('quarter'));
  let thisSeasonEnd = formatDate(moment(today).endOf('quarter'));
  let lastSeasonStart = formatDate(moment(today).subtract(1, 'quarter').startOf('quarter'));
  let lastSeasonEnd = formatDate(moment(today).subtract(1, 'quarter').endOf('quarter'));

  return {
    today,
    yesterday,
    thisWeekStart,
    thisWeekEnd,
    lastWeekStart,
    lastWeekEnd,
    thisSeasonStart,
    thisSeasonEnd,
    lastSeasonStart,
    lastSeasonEnd,
  };
}

export function setdate() {
  let firstDateTmp = new Date();
  firstDateTmp.setDate(1);
  let fdd = String(firstDateTmp.getDate()).padStart(2, '0');
  let fmm = String(firstDateTmp.getMonth() + 1).padStart(2, '0'); //January is 0!
  let fyyyy = firstDateTmp.getFullYear();
  const firstDate = fyyyy + '-' + fmm + '-' + fdd;

  let endDateTmp = new Date(firstDateTmp);
  endDateTmp.setMonth(endDateTmp.getMonth() + 1);
  endDateTmp.setDate(0);
  let edd = String(endDateTmp.getDate()).padStart(2, '0');
  let emm = String(endDateTmp.getMonth() + 1).padStart(2, '0'); //January is 0!
  let eyyyy = endDateTmp.getFullYear();

  const endDate = eyyyy + '-' + emm + '-' + edd;
  return [firstDate, endDate];
}

export function getToday() {
  let todayTmp = new Date();
  // todayTmp.setMonth(todayTmp.getMonth() + 1);
  // todayTmp.setDate(0);
  let dd = String(todayTmp.getDate()).padStart(2, '0');
  let mm = String(todayTmp.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = todayTmp.getFullYear();

  const Today = yyyy + '-' + mm + '-' + dd;
  return Today;
}

export function getMonthdate() {
  let firstDateTmp = new Date();
  firstDateTmp.setMonth(0);
  let fdd = String(firstDateTmp.getDate()).padStart(2, '0');
  let fmm = String(firstDateTmp.getMonth() + 1).padStart(2, '0'); //January is 0!
  let fyyyy = firstDateTmp.getFullYear();
  const firstDate = fyyyy + '-' + fmm;

  let endDateTmp = new Date(firstDateTmp);
  // endDateTmp.setMonth(endDateTmp.getMonth() + 1);
  endDateTmp.setFullYear(endDateTmp.getFullYear() + 1);
  endDateTmp.setDate(0);
  let edd = String(endDateTmp.getDate()).padStart(2, '0');
  let emm = String(endDateTmp.getMonth() + 1).padStart(2, '0'); //January is 0!
  let eyyyy = endDateTmp.getFullYear();

  const endDate = eyyyy + '-' + emm;
  return [firstDate, endDate];
}

export function transformDate(searchStartDate, searchEndDate) {
  const start = moment(searchStartDate);
  const end = moment(searchEndDate);
  const diffDays = end.diff(start, 'day') + 1;
  if (diffDays < 7) {
    searchStartDate = moment(searchEndDate).subtract(6, 'days').format('YYYY-MM-DD');
  }
  return searchStartDate;
}

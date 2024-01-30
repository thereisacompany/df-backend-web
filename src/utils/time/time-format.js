import moment from 'moment';

export function formatDate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function getDayAllDash(begin, end) {
  var dateAllArr = [];
  var today = Date.parse(new Date(begin));
  var futur = Date.parse(new Date(end));
  var roun = futur - today;
  var day = roun / (3600 * 24) / 1000;
  var time;
  var reg;
  for (var i = 0; i <= day; i++) {
    time = new Date(today);
    var yyyy = time.getFullYear(); //.toLocaleDateString().slice(0,4)
    var MM = (time.getMonth() + 1 < 10 ? '0' : '') + (time.getMonth() + 1);
    var dd = (time.getDate() < 10 ? '0' : '') + time.getDate();

    dateAllArr.push(yyyy + '-' + MM + '-' + dd);
    today = today + 24 * 60 * 60 * 1000;
  }
  return dateAllArr;
}

import { formatThousandthNumber } from '/@/utils/number/number-format.js';
export class TFReportDailyResult {
  constructor(APIData) {
    this.data = APIData;
    // console.log('this.dat', this.data);
    this.itemMap = {
      // accountDate: "2022-07-01"
      // bbballreportbet: 200
      // bbballreportpayoff: -200
      // bblivereportbet: 0
      // bblivereportpayoff: 0
      // dddreportbet: 0
      // dddreportpayoff: 0
      // memberId: "zozo22"
      // nbbsportrepotbet: 0
      // nbbsportrepotpayoff: 0
      // otherreportbet: 15051.9
      // otherreportpayoff: 601.16
      // payofftotal: 401.16
      // tsreportbet: 0
      // tsreportpayoff: 0
      // validbettotal: 15251.9

      accountDate: { name: '日期', order: 1 },
      memberId: { name: '會員帳號', order: 2 },
      tsreportbet: { name: '體育流水', order: 3 },
      dddreportbet: { name: '3D流水', order: 4 },
      otherreportbet: { name: '其他流水', order: 5 },
      bblivereportbet: { name: 'KU流水', order: 6 },
      bbballreportbet: { name: '彩票流水', order: 7 },
      nbbsportrepotbet: { name: '自營流水', order: 8 },
      validbettotal: { name: '訂單合計', order: 9 },
      tsreportpayoff: { name: '體育盈利', order: 10 },
      dddreportpayoff: { name: '3D盈利', order: 11 },
      otherreportpayoff: { name: '其他盈利', order: 12 },
      bblivereportpayoff: { name: 'KU盈利', order: 13 },
      bbballreportpayoff: { name: '彩票盈利', order: 14 },
      nbbsportrepotpayoff: { name: '自營盈利', order: 15 },
      payofftotal: { name: '盈利合計', order: 16 },
    };
    this.result = this.init();
  }
  init() {
    return Object.keys(this.itemMap).map((key) => {
      const val = this.itemMap[key];
      return { name: val.name, oder: val.order, key, data: [] };
    });
  }
  getData() {
    const changeData = this.transformData(this.data);
    // console.log('changeData2', changeData);

    return changeData;
  }

  transformData(data) {
    let resultData = [];

    //再來處理資料
    Object.entries(data).forEach((item) => {
      // let key = item[0] * 1;
      let value = item[1];

      value['BBLiveReportValidbet'] = this.formatNumber(
        this.roundDecimal(value.BBLiveReportValidbet, 2),
      );
      value['BBLiveReportpayoff'] = this.formatNumber(
        this.roundDecimal(value.BBLiveReportpayoff, 2),
      );
      value['BB_BallReportValidbet'] = this.formatNumber(
        this.roundDecimal(value.BB_BallReportValidbet, 2),
      );
      value['BB_BallReportpaoff'] = this.formatNumber(
        this.roundDecimal(value.BB_BallReportpaoff, 2),
      );
      value['DDDReportValidbet'] = this.formatNumber(this.roundDecimal(value.DDDReportValidbet, 2));
      value['DDDReportpayoff'] = this.formatNumber(this.roundDecimal(value.DDDReportpayoff, 2));
      value['NBBSportReportValidbet'] = this.formatNumber(
        this.roundDecimal(value.NBBSportReportValidbet, 2),
      );
      value['NBBSportReportpayoff'] = this.formatNumber(
        this.roundDecimal(value.NBBSportReportpayoff, 2),
      );
      value['OtherReportValidbet'] = this.formatNumber(
        this.roundDecimal(value.OtherReportValidbet, 2),
      );
      value['OtherReportpayoff'] = this.formatNumber(this.roundDecimal(value.OtherReportpayoff, 2));
      value['TSReportValidbet'] = this.formatNumber(this.roundDecimal(value.TSReportValidbet, 2));
      value['TSReportpayoff'] = this.formatNumber(this.roundDecimal(value.TSReportpayoff, 2));
      value['payofftotal'] = this.formatNumber(this.roundDecimal(value.payofftotal, 2));
      value['validbetTotal'] = this.formatNumber(this.roundDecimal(value.validbetTotal, 2));

      resultData.push(value);
      // console.log('DailyresultData 111......', value.BBLiveReportValidbet);
      // let oldkey = oldresultData[key + 1];
      // console.log('oldkey', oldkey);

      // console.log('key', key, 'key1', item[key + 1], 'value', value);
    });

    // console.log('datadatadata>>>', data);

    // this.itemMap['rate']['value'] =
    //   (this.itemMap['payoff']['value'] / this.itemMap['commissionable']['value']) * 100;

    return resultData;
  }
  filterAndSortData(data) {
    const filterData = data.filter((item) => item.title);
    filterData.sort((a, b) => {
      return a.sort - b.sort;
    });
    return filterData;
  }
  formatNumber(value) {
    //數字千分位
    value += '';
    let arr = value.split('.');
    let re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, '$1,') + (arr.length == 2 ? '.' + arr[1] : '');
  }

  roundDecimal(val, precision = 2) {
    //帶小數的四捨五入
    return (
      Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
      Math.pow(10, precision || 0)
    );
  }
}

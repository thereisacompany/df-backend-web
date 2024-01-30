import { formatThousandthNumber } from '/@/utils/number/number-format.js';
export class TFReportProfitResult {
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

      // accountDate: { name: '日期', order: 1 },
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
    const tmpdata = this.data;
    const changeData = this.transformData(tmpdata);
    // console.log('changeData2', changeData);

    return changeData;
  }
  getDataBet() {
    const tmpdatax = this.data;
    const changeDataBet = this.transformDataBet(tmpdatax);
    // console.log('changeData2', changeData);

    return changeDataBet;
  }

  transformData(data) {
    let resultData = [];

    //再來處理資料
    Object.entries(data).forEach((item) => {
      // let key = item[0] * 1;
      let value = item[1];

      // "date": "2022-02",
      // "betAmount": "0",
      // "payoff": "0",
      // "profit": 0

      value['date'] = value.date;
      // value['betAmount'] = this.formatNumber(this.roundDecimal(value.betAmount, 2));
      // value['payoff'] = this.formatNumber(this.roundDecimal(value.payoff, 2));
      // value['profit'] = this.formatNumber(this.roundDecimal(value.profit, 2));

      value['betAmount'] = this.roundDecimal(value.betAmount, 2);
      value['payoff'] = this.roundDecimal(value.payoff, 2);
      value['profit'] = this.roundDecimal(value.profit, 2);

      resultData.push(value);
    });

    return resultData;
  }
  transformDataBet(data) {
    let resultDataBet = [];

    //再來處理資料
    Object.entries(data).forEach((item) => {
      // let key = item[0] * 1;
      let value = item[1];

      // "date": "2022-02",
      // "betAmount": "0",
      // "payoff": "0",
      // "profit": 0

      value['date'] = value.date;
      // value['betAmount'] = this.formatNumber(this.roundDecimal(value.betAmount, 2));
      // value['payoff'] = this.formatNumber(this.roundDecimal(value.payoff, 2));
      // value['profit'] = this.formatNumber(this.roundDecimal(value.profit, 2));
      console.log(value.betAmount);
      value['betAmount'] = this.roundDecimal(value.betAmount, 2);
      value['payoff'] = this.roundDecimal(value.payoff, 2);
      value['profit'] = this.roundDecimal(value.profit, 2);

      resultDataBet.push(value);
    });

    return resultDataBet;
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

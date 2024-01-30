import { formatThousandthNumber } from '/@/utils/number/number-format.js';
export class TFReportHourResult {
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

      /*
         "date": "2022-08-11 15",
        "D3DAtValidbet": 0,
        "ValidbetAtTotal": 0,
        "Otherpayoff": 0,
        "OtherValidbet": 0,
        "NbbAttpayoff": 0,
        "BallAtpaoff": 0,
        "KuAtValidbet": 0,
        "Kupayoff": -951.3,
        "KuValidbet": 958,
        "OtherAtValidbet": 0,
        "NbbAtValidbet": 0,
        "TSValidbet": 0,
        "D3DValidbet": 0,
        "KuAtpayoff": 0,
        "payofftotal": -951.3,
        "NbbValidbet": 0,
        "D3Dpayoff": 0,
        "Ballpaoff": 0,
        "BallValidbet": 0,
        "payoffAttotal": 0,
        "Nbbpayoff": 0,
        "BallAtValidbet": 0,
        "TSAtpayoff": 0,
        "TSpayoff": 0,
        "D3DAtpayoff": 0,
        "ValidbetTotal": 958,
        "TSAtValidbet": 0,
        "OtherAtpayoff": 0,
        "memberid": "chiuchea"




      */

      value['date'] = value.date;
      value['memberid'] = value.memberid;
      value['ValidbetAtTotal'] = this.formatNumber(this.roundDecimal(value.ValidbetAtTotal, 2));
      value['Otherpayoff'] = this.formatNumber(this.roundDecimal(value.Otherpayoff, 2));
      value['OtherValidbet'] = this.formatNumber(this.roundDecimal(value.OtherValidbet, 2));
      // value['D3Dpayoff'] = this.formatNumber(this.roundDecimal(value.D3Dpayoff, 2));
      value['BallAtpaoff'] = this.formatNumber(this.roundDecimal(value.BallAtpaoff, 2));
      value['KuAtValidbet'] = this.formatNumber(this.roundDecimal(value.KuAtValidbet, 2));
      value['Kupayoff'] = this.formatNumber(this.roundDecimal(value.Kupayoff, 2));
      value['KuValidbet'] = this.formatNumber(this.roundDecimal(value.KuValidbet, 2));
      value['OtherAtValidbet'] = this.formatNumber(this.roundDecimal(value.OtherAtValidbet, 2));

      value['D3DValidbet'] = this.formatNumber(this.roundDecimal(value.D3DValidbet, 2));
      value['D3DAtValidbet'] = this.formatNumber(this.roundDecimal(value.D3DAtValidbet, 2));
      value['TSValidbet'] = this.formatNumber(this.roundDecimal(value.TSValidbet, 2));
      value['KuAtpayoff'] = this.formatNumber(this.roundDecimal(value.KuAtpayoff, 2));
      value['payofftotal'] = this.formatNumber(this.roundDecimal(value.payofftotal, 2));

      value['NbbValidbet'] = this.formatNumber(this.roundDecimal(value.NbbValidbet, 2));
      value['NbbAtValidbet'] = this.formatNumber(this.roundDecimal(value.NbbAtValidbet, 2));
      value['NbbAtpayoff'] = this.formatNumber(this.roundDecimal(value.NbbAtpayoff, 2));
      value['Nbbpayoff'] = this.formatNumber(this.roundDecimal(value.Nbbpayoff, 2));

      value['Ballpaoff'] = this.formatNumber(this.roundDecimal(value.Ballpaoff, 2));
      value['BallValidbet'] = this.formatNumber(this.roundDecimal(value.BallValidbet, 2));
      value['payoffAttotal'] = this.formatNumber(this.roundDecimal(value.payoffAttotal, 2));

      value['BallAtValidbet'] = this.formatNumber(this.roundDecimal(value.BallAtValidbet, 2));
      value['TSAtpayoff'] = this.formatNumber(this.roundDecimal(value.TSAtpayoff, 2));
      // value['TSpayoff'] = this.formatNumber(this.roundDecimal(value.TSpayoff, 2));

      value['TSpayoff'] = value.TSpayoff;
      value['D3Dpayoff'] = value.D3Dpayoff;
      value['ValidbetTotal'] = this.formatNumber(this.roundDecimal(value.ValidbetTotal, 2));
      value['D3DAtpayoff'] = this.formatNumber(this.roundDecimal(value.D3DAtpayoff, 2));
      value['TSAtValidbet'] = this.formatNumber(this.roundDecimal(value.TSAtValidbet, 2));
      value['OtherAtpayoff'] = this.formatNumber(this.roundDecimal(value.OtherAtpayoff, 2));

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

import { formatThousandthNumber } from '/@/utils/number/number-format.js';
export class TFReportResult {
  constructor(APIData) {
    this.data = APIData;
    // console.log('this.dat', this.data);
    this.itemMap = {
      // BetAmount: { name: "貨量", order: 1 },
      // Payoff: { name: "損益", order: 2 },
      // count_User: { name: "下注人數", order: 3 },
      // WagersTotal: { name: "單量", order: 4 },
      // cost: { name: "優惠成本", order: 5 },
      // entry: { name: "入款", order: 6 },
      // withdraw: { name: "出款", order: 7 },
      // betAmount: { name: '貨量', order: 1 },
      validBet: { name: '流水', order: 1 },
      payoff: { name: '盈利', order: 2 },
      memberTotal: { name: '投注人數', order: 3 },
      orderTotal: { name: '投注筆數', order: 4 },
      // rebateAmount: { name: '反水', order:  },
      profit: { name: '殺數', order: 5 },
      membergrowing: { name: '投注人數成長比例', order: 6 },
      ordergrowing: { name: '投注單筆成長比例', order: 7 },
      betAmountgrowing: { name: '流水成長比例', order: 8 },
      payoffgrowing: { name: '盈利成長比例', order: 9 },
      avgorder: { name: '平均注單比數', order: 10 },
      avgordergrowing: { name: '平均注單筆數成長比例', order: 11 },
      avgbet: { name: '平均流水', order: 12 },
      avgbetgrowing: { name: '平均流水成長比例', order: 13 },
      avgpayoff: { name: '平均盈利', order: 14 },
      avgpayoffgrowing: { name: '平均盈利成長比例', order: 15 },
    };
  }
  getData() {
    const changeData = this.transformData(this.data);
    console.log('changeData2', changeData);

    return changeData;
  }

  transformData(data) {
    let resultData = [];
    let oldresultData = data;

    //先增加所需的欄位
    Object.entries(data).forEach((item) => {
      let key = item[0] * 1;
      let value = item[1];
      //把該有欄位補齊
      value['membergrowing'] = 0; //投注人數成長比例
      value['ordergrowing'] = 0; //投注單筆成長比例
      value['validBetgrowing'] = 0; //流水成長比例
      value['payoffgrowing'] = 0; //盈利成長比例
      value['avgorder'] = 0; //平均注單比數
      value['avgordergrowing'] = 0; //平均注單筆數成長比例
      value['avgvalidBet'] = 0; //平均流水
      value['avgvalidBetgrowing'] = 0; //平均流水成長比例
      value['avgpayoff'] = 0; //平均盈利
      value['avgpayoffgrowing'] = 0; //平均盈利成長比例
      value['profit'] = 0; //殺數

      // if (this.itemMap[key] != undefined) this.itemMap[key]['value'] = value;
    });

    //再來處理資料
    Object.entries(data).forEach((item) => {
      let key = item[0] * 1;
      let value = item[1];

      if (key + 1 === data.length) {
        // if (key === 0) {
        //   //殺數
        //   value['profit'] = this.roundDecimal((value.payoff / value.validBet) * 100, 2);
        //   //流水
        //   value['validBet'] = this.formatNumber(this.roundDecimal(value.validBet, 2));
        //   //營利
        //   value['payoff'] = this.formatNumber(this.roundDecimal(value.payoff, 2));
        //   //人數
        //   value['memberTotal'] = this.formatNumber(this.roundDecimal(value.memberTotal, 0));

        //   //注單
        //   value['orderTotal'] = this.formatNumber(this.roundDecimal(value.orderTotal, 0));

        //   resultData.push(value);
        // }

        return;
      } else {
        let oldkey = oldresultData[key + 1];
        // oldkey.memberTotal;

        // console.log('new membertotal', value.memberTotal, 'old membertotal', oldkey.memberTotal);
        //投注人數成長比例
        value['membergrowing'] = this.roundDecimal(
          ((value.memberTotal - oldkey.memberTotal) / oldkey.memberTotal) * 100,
          2,
        );
        //投注單筆成長比例
        value['ordergrowing'] = this.roundDecimal(
          ((value.orderTotal - oldkey.orderTotal) / oldkey.orderTotal) * 100,
          2,
        );

        //流水成長比例
        value['validBetgrowing'] = this.roundDecimal(
          ((value.validBet - oldkey.validBet) / oldkey.validBet) * 100,
          2,
        );
        //盈利成長比例
        value['payoffgrowing'] = this.roundDecimal(
          ((value.payoff - oldkey.payoff) / oldkey.payoff) * 100,
          2,
        );
        //殺數
        value['profit'] = this.roundDecimal((value.payoff / value.validBet) * 100, 2);

        //流水
        value['validBet'] = this.formatNumber(this.roundDecimal(value.validBet, 2));

        //營利
        value['payoff'] = this.formatNumber(this.roundDecimal(value.payoff, 2));

        //人數
        value['memberTotal'] = this.formatNumber(this.roundDecimal(value.memberTotal, 0));

        //注單
        value['orderTotal'] = this.formatNumber(this.roundDecimal(value.orderTotal, 0));

        resultData.push(value);
      }

      console.log('resultData ......', resultData);
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

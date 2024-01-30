import { formatThousandthNumber } from '/@/utils/number/number-format.js';
export class TFTopResult {
  constructor(APIData) {
    console.log('this.dat', APIData);
    this.data = APIData.data.result.nowData;
    // console.log('this.dat', this.data);
    this.itemMap = {
      betAmount: {
        title: '貨量',
        unit: '越南幣',
        icon: 'total-sales|svg',
        color: 'green',
        action: '月',
        keyname: 'betAmount',
        sort: 1,
      },
      commissionable: {
        title: '流水',
        unit: '越南幣',
        icon: 'total-sales|svg',
        color: 'green',
        action: '月',
        keyname: 'commissionable',
        sort: 2,
      },
      payoff: {
        title: '損益',
        unit: '越南幣',
        icon: 'total-sales|svg',
        color: 'green',
        action: '月',
        keyname: 'payoff',
        sort: 3,
      },

      memberTotal: {
        title: '下注人數',
        unit: '人',
        icon: 'download-count|svg',
        color: 'green',
        action: '月',
        keyname: 'memberTotal',
        sort: 4,
      },
      rate: {
        title: '殺數',
        unit: '%',
        icon: 'transaction|svg',
        color: 'green',
        action: '月',
        keyname: 'rate',
        sort: 5,
      },
      orderTotal: {
        title: '注單',
        unit: '張',
        icon: 'visit-count|svg',
        color: 'green',
        action: '月',
        keyname: 'orderTotal',
        sort: 6,
      },
      // entry: { name: '入款', unit: '人民幣', sort: 5 },
      // withdraw: { name: '出款', unit: '人民幣', sort: 6 },
    };
  }
  getData() {
    // const changeData = this.transformData(this.data);
    const changeData2 = this.transformData2(this.data);
    console.log('changeData2', changeData2);
    // const result = this.filterAndSortData(changeData);
    return changeData2;
  }
  transformData(data) {
    return Object.keys(data).map((key) => {
      if (
        key === 'Commission' ||
        key === 'WagersTotal' ||
        key === 'endDate' ||
        key === 'startDate' ||
        key === 'orderTotal' ||
        key === 'betAmount' ||
        key === 'rebate'
      ) {
        return {};
      }
      const item = this.itemMap[key];
      // console.log('name', item);
      let val;
      if (key == 'rate') {
        val = (this.itemMap['PayOff']['value'] / this.itemMap['Commissionable']['value']) * 100;
      } else {
        val = Math.floor(data[key]);
      }
      return {
        title: item.name,
        sort: item.sort,
        unit: item.unit,
        icon: item.icon,
        color: item.color,
        action: item.unit,
        value: val,
        // value: Math.floor(formatThousandthNumber(data[key])),
      };
    });
  }

  transformData2(data) {
    let resultData = [];
    Object.entries(data).forEach((item) => {
      let key = item[0];
      let value = item[1];

      if (this.itemMap[key] != undefined) this.itemMap[key]['value'] = value;
    });
    this.itemMap['rate']['value'] =
      (this.itemMap['payoff']['value'] / this.itemMap['commissionable']['value']) * 100;

    Object.entries(this.itemMap).forEach((item) => {
      if (
        item[0] === 'Commission' ||
        item[0] === 'WagersTotal' ||
        item[0] === 'endDate' ||
        item[0] === 'startDate' ||
        item[0] === 'orderTotal' ||
        item[0] === 'betAmount' ||
        item[0] === 'rebate'
      ) {
        return;
      }
      let obj = item[1];
      if (item[0] != 'rate') {
        obj['value'] = this.roundDecimal(obj['value'], 0);
      } else {
        obj['value'] = this.roundDecimal(obj['value'], 2);
      }
      // obj['title'] = item.name;
      // obj['unit'] = item.unit;
      // obj['icon'] = item.icon;
      // obj['color'] = item.color;
      // obj['action'] = item.unit;
      resultData.push(obj);
    });
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

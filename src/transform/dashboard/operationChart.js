import moment from 'moment';
import { getDayAllDash } from '/@/utils/time/time-format';
export class TFOperation {
  constructor(APIData, searchStarDate, searchEndDate) {
    this.data = APIData;
    this.searchStarDate = searchStarDate;
    this.searchEndDate = searchEndDate;
    this.itemMap = {
      // BetAmount: { name: "貨量", order: 1 },
      // Payoff: { name: "損益", order: 2 },
      // count_User: { name: "下注人數", order: 3 },
      // WagersTotal: { name: "單量", order: 4 },
      // cost: { name: "優惠成本", order: 5 },
      // entry: { name: "入款", order: 6 },
      // withdraw: { name: "出款", order: 7 },
      // betAmount: { name: '貨量', order: 1 },
      validBet: { name: '流水', order: 2 },
      payoff: { name: '盈利', order: 3 },
      memberTotal: { name: '投注人數', order: 4 },
      betCount: { name: '投注筆數', order: 5 },
      // rebateAmount: { name: '反水', order: 6 },
      profit: { name: '殺數', order: 7 },
    };
    this.typeMap = {
      // 1: { name: "體育", color: "#000", type: "line" },
      // 2: { name: "彩票", color: "#90ED7D", type: "line" },
      // 3: { name: "視訊", color: "#F7A35C", type: "line" },
      // 5: { name: "電子", color: "#8085E9", type: "line" },
      // 6: { name: "棋牌", color: "#F15C80", type: "line" },
      BBLiveReport: { name: 'BBLiveReport', color: '#000', type: 'line', data: [] },
      OtherReport: { name: 'OtherReport', color: '#90ED7D', type: 'line', data: [] },
      BB_BallReport: { name: 'BB_BallReport', color: '#F7A35C', type: 'line', data: [] },
      TSReport: { name: 'TSReport', color: '#8085E9', type: 'line', data: [] },
      DDDReport: { name: 'DDDReport', color: '#F15C80', type: 'line', data: [] },
      NBBSportReport: { name: 'NBBSportReport', color: '#F15C80', type: 'line', data: [] },
      total: { name: 'total', color: '#7CB5EC', type: 'bar' },
    };
    this.result = this.init();

    console.log('this.result', this.result);
  }
  init() {
    return Object.keys(this.itemMap).map((key) => {
      const val = this.itemMap[key];
      return { name: val.name, oder: val.order, key, data: [] };
    });
  }
  getData() {
    const chartData = this.transformData();
    const date = this.transformDate();

    return {
      chartData,
      date,
    };
  }
  transformData() {
    // console.log("this.data........",this.data);
    this.data.forEach((item) => {
      console.log('>>>', item);
      const data = item.data;
      // console.log('data.....', data);
      Object.keys(data).forEach((key) => {
        // console.log('key.....', key);
        if (key === 'betAmount' || key === 'rebateAmount') {
        } else {
          const val = data[key];
          const mapItem = this.result.find((item) => item.key === key);
          // console.log("mapItem",mapItem);
          if (!mapItem.data.length) {
            mapItem.data = this.initTypeData(val);
          }
          mapItem.data = this.dispatchTypeData(mapItem.data, val);
        }
      });
    });
    return this.result;
  }
  getDateRangeAmount() {
    const start = moment(this.searchStarDate);
    const end = moment(this.searchEndDate);
    const diffDays = end.diff(start, 'day') + 1;
    return diffDays;
  }
  //特殊規則，當選取日期範圍小於七天則算七天
  transformDate() {
    const range = this.getDateRangeAmount();
    // if (range < 7) {
    //   this.searchStarDate = moment(this.searchEndDate)
    //     .subtract(6, "days")
    //     .format("YYYY-MM-DD");
    // }
    // console.log('start', this.searchStarDate, 'end', this.searchEndDate);
    return getDayAllDash(this.searchStarDate, this.searchEndDate);
  }

  initTypeData(typeData) {
    // console.log('initTypeData', typeData);
    return Object.keys(typeData)
      .sort()
      .map((key) => {
        // console.log('initTypeData', key);
        return {
          key,
          name: this.typeMap[key].name,
          data: [],
          type: this.typeMap[key].type,
          color: this.typeMap[key].color,
        };
      });
  }
  dispatchTypeData(data, val) {
    //  console.log('dispatchTypeData', data, val);
    Object.keys(val).forEach((key) => {
      let findData = data.find((item) => item.key == key);
      const valFormated = Math.round(val[key]);

      findData.data.push(valFormated);
    });
    return data;
  }
}

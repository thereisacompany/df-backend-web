import { defineStore } from 'pinia';
import { store } from '/@/store';

interface ChartState {
  pushMsgData: any;
  count: number;
}

export const useChart = defineStore({
  id: 'tg-robot',
  state: (): ChartState => ({
    pushMsgData: [],
    count: 0,
  }),

  getters: {
    getCount(): number {
      return this.count;
    },
  },
  actions: {
    fetchPushMsg(row) {
      this.pushMsgData = row;
      this.count += 1;
      console.log('fetchPushMsg');
    },
    getPushMsg() {
      return this.pushMsgData;
    },
  },
});

export function useChartWithOut() {
  return useChart(store);
}

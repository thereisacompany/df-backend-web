import { defineStore } from 'pinia';
import { store } from '/@/store';

interface ChartState {
  pushMsgData: any;
  count: number;
}

export const useCSChart = defineStore({
  id: 'cs-chat',
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
    },
    getPushMsg() {
      return this.pushMsgData;
    },
  },
});

export function useCSChartWithOut() {
  return useCSChart(store);
}

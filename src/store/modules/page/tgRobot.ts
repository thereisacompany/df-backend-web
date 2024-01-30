import { defineStore } from 'pinia';
import { store } from '/@/store';

interface RobotState {
  pushMsgData: any;
  count: number;
}

export const useRobotState = defineStore({
  id: 'tg-robot',
  state: (): RobotState => ({
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
      console.log('store', row);
      this.pushMsgData = row;
      this.count += 1;
    },
    getPushMsg() {
      return this.pushMsgData;
    },
  },
});

export function useRobotStateWithOut() {
  return useRobotState(store);
}

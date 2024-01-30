import { defineStore } from 'pinia';
import { store } from '/@/store';

interface MQTTState {
  subscription: any;
}

export const useMQTTStore = defineStore({
  id: 'app-MQTT',
  state: (): MQTTState => ({
    subscription: {},
  }),
  getters: {
    getSubscription(): string[] | number[] {
      return this.subscription;
    },
  },
  actions: {
    setSubscription(): string[] | number[] {
      this.subscription = [];
      this.subscription.push({
        topic: 'system/updateWebsite',
        qos: '1',
        memo: '更新網站',
        payload: 'update',
      });
      return this.subscription;
    },
  },
});

// Need to be used outside the setup
export function useMQTTStoreWithOut() {
  return useMQTTStore(store);
}

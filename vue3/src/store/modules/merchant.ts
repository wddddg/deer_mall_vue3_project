/*
 * @Descripttion:
 * @version:
 * @Author: Xutao
 * @Date: 2022-07-26 10:07:03
 * @LastEditors: XuTao
 * @LastEditTime: 2022-07-26 10:19:07
 */
import { defineStore } from 'pinia';
import { store } from '/@/store';

export const useMerchantStore = defineStore({
  id: 'merchant',
  state: () => ({
    accountInfo: null,
  }),
  getters: {
    getAccountInfo() {
      return this.accountInfo;
    },
  },
  actions: {
    setAccountInfo(info) {
      this.accountInfo = info;
    },
  },
});

// Need to be used outside the setup
export function useMerchantStoreWithOut() {
  return useMerchantStore(store);
}

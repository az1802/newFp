/*
 * @Author: sunjie
 * @Date: 2022-02-14 15:36:30
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 12:09:32
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/merchant.js
 */
import { maxBy, minBy } from "lodash";
export default {
  state: {
    merchantInfo: {},
    fanpiaoList: [],
    couponList: [],
    fanpiaoUserAvaterList: [],
    fanpiaoUserNum: 0,
  },
  getters: {
    maxDiscountFanpiao(state) {
      return maxBy(state.fanpiaoList, item => item.discount) || {};
    },
    minDiscountFanpiao(state) {
      return minBy(state.fanpiaoList, item => item.discount) || {};
    },
  },
  mutations: {
    setMerchantInfo(state, merchantInfo) {
      state.merchantInfo = merchantInfo;
    },
    setFanpiaoList(state, fanpiaoList) {
      state.fanpiaoList = fanpiaoList;
    },
    setCouponList(state, couponList) {
      state.couponList = couponList;
    },
    setFanpiaoUserList(state, fanpiaoUserAvaterList) {
      state.fanpiaoUserAvaterList = fanpiaoUserAvaterList;
    },
    setFanpiaoUserNum(state, fanpiaoUserNum) {
      state.fanpiaoUserNum = fanpiaoUserNum;
    },

  }
}
/*
 * @Author: sunjie
 * @Date: 2022-02-09 16:58:52
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:31
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/user.js
 */
export default {
  state: {
    userId: "d4848915-b103-4e1a-abfd-a04886fa61e6",//用户id
    userWallet: {
      fanpiaoBalance: "",//饭票余额
      redPacketBalance: "", //红包余额
      memberCardBalance: "", //储值余额
      fanpiaoPaidFee: "",//饭票可以抵扣的现金金额
    },
    phone: "",//手机号码
    userCoupons: [],//用户券包
    userInfo: { //用户信息
      nickname: "sunjie",
    },
    stats: { //用户最近营销使用

    },
    userFanpiaoRecords: [],//用户的饭票使用记录
    userAddressList: [], //用户的地址列表
    userMerchantCoupons: [],//用户在所含的商户券
  },
  getters: {

  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setStats(state, stats) {
      state.stats = stats
    },
    setUserFanpiaoRecords(state, userFanpiaoRecords) {
      state.userFanpiaoRecords = userFanpiaoRecords
    },
    setPhone(state, phone) {
      state.phone = phone;
    },
    setUserAddressList(state, userAddressList) {
      state.userAddressList = userAddressList;
    },
    setUserMerchantCoupons(state, userMerchantCoupons) {
      state.userMerchantCoupons = userMerchantCoupons;
    },
    setUserWallet(state, walletObj) {
      for (let key in walletObj) {
        state.userWallet[key] = walletObj[key];
      }
    }

  },
  actions: {

  }
}
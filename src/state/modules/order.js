/*
 * @Author: sunjie
 * @Date: 2022-02-18 14:16:23
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:34
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/order.js
 */
export default {
  state: {
    payMethod: "WECHAT",//支付方式
    orderId: "",
    orderInfo: {
      id: "",//订单id
      remark: "群备注的想",//订单备注
      billFee: 150,//账单金额
      paidFee: 100,//支付金额 饭票支付金额为动态的更新
      phoneMemberDiscount: 11,//会员折扣
    }
  },
  getters: {

  },
  mutations: {
    setPayMethod(state, payMethod) {
      state.payMethod = payMethod;
    },
  },
  actions: {

  }
}
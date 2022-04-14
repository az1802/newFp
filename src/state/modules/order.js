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
      orderId: "",//订单id
      remark: "群备注的想",//订单备注
      billFee: 0,//账单金额
      paidFee: 0,//支付金额 饭票支付金额为动态的更新
      phoneMemberDiscount: 11,//会员折扣
      groupDiningEventId: "", //TODO 保留字段
      appointmentTime: "", //TODO 保留字段
      isTakeAway: false, //是否是外卖
      takeAwayTime: "", //外卖时间 
      selectedAddress: {},//选择地址
      shippingAddressId: "", //配送地址
      shippingFee: 0, //配送费
      mealType: "",//就餐模式
      onlyForPay: false,
      peopleCount: 0, //就餐人数
      tableId: "", //桌台id
      tableName: "", //桌台名称
      discountAmount: 0, //优惠金额 
      couponPackageId: "",//券包合并支付的id
      isBuyCouponPackage: "", //是否开启券包合并支付
      selCouponReduceCost: '', //使用券包的价格
      selCouponId: "",//使用券包的id
      isAgreeCouponAccord: true, //是否统一付费券包协议
    }
  },
  getters: {

  },
  mutations: {
    setPayMethod(state, payMethod) {
      state.payMethod = payMethod;
    },
    setOrderInfo(state, orderInfoObj) {
      for (let key in orderInfoObj) {
        state.orderInfo[key] = orderInfoObj[key];
      }
    }
  },
  actions: {

  }
}
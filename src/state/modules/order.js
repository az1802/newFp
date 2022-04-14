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
      remark: "测试备注",//订单备注
      billFee: 80000,//账单金额
      paidFee: 80000,//支付金额 饭票支付金额为动态的更新
      packageFee: 0,//打包费
      discountAmount: 0, //菜品折扣已优惠的价格
      phoneMemberDiscount: 11,//会员折扣
      groupDiningEventId: "", //TODO 保留字段
      appointmentTime: "", //TODO 保留字段
      isTakeAway: false, //是否是外卖
      takeAwayTime: "", //外卖时间 
      selectedAddress: {},//选择地址
      shippingAddressId: "", //配送地址对应id
      shippingFee: 0, //配送费
      mealType: "",//就餐模式
      onlyForPay: false,
      peopleCount: 0, //就餐人数
      tableId: "", //桌台id
      tableName: "", //桌台名称
      couponPackageId: "",//券包合并支付的id
      isBuyCouponPackage: false, //是否开启券包合并支付
      selCouponReduceCost: 0, //使用券包的价格
      selCouponId: "",//使用券包的id
      isAgreeCouponAccord: true, //是否统一付费券包协议
    },
    orderFanpiaoPayInfo: {
      fanpiaoPaidFee: 0,
      fanpiaoRemainPaidFee: 0,
      recommendFanpiaoList: [],
      selFanpiaoId: "",
      selFanpiaoInfo: "",
    }
  },
  getters: {
    finalFanpiaoPaidFee(state) {
      let { payMethod, } = state;
      let { fanpiaoPaidFee,
        fanpiaoRemainPaidFee,
        selFanpiaoId,
        selFanpiaoInfo } = state.orderFanpiaoPayInfo
      if (payMethod == "FANPIAO_PAY") {
        if (fanpiaoRemainPaidFee > 0 && selFanpiaoId) { //根据选择的饭票进行最终扣除饭票价格的计算
          return fanpiaoPaidFee + (fanpiaoRemainPaidFee * (1 - (selFanpiaoInfo?.discount || 0) / 100));
        } else {
          return fanpiaoPaidFee;
        }
      }
      return 0;
    }
  },
  mutations: {
    setPayMethod(state, payMethod) {
      state.payMethod = payMethod;
    },
    setOrderInfo(state, orderInfoObj) {
      for (let key in orderInfoObj) {
        state.orderInfo[key] = orderInfoObj[key];
      }
    },
    setOrderFanpiaoPayInfo(state, orderFanpiaoPayObj) {
      for (let key in orderFanpiaoPayObj) {
        state.orderFanpiaoPayInfo[key] = orderFanpiaoPayObj[key];
      }
    }
  },
  actions: {

  }
}
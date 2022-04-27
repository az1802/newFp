/*
 * @Author: sunjie
 * @Date: 2022-02-18 14:16:23
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:34
 * @FilePath: /new-fanpiao-uniapp/src/state/modules/order.js
 */
export default {
  state: {
    payMethod: "WECHAT_PAY",//支付方式
    orderId: "",
    orderInfo: {
      pendingOrderId: "",
      penddingOrderDishList: [],
      currentType: "CREATE",
      orderId: "",//订单id
      remark: "",//订单备注
      billFee: 0,//账单金额
      packageFee: 0,//打包费
      discountAmountPrice: 0, //菜品折扣已优惠的价格
      phoneMemberDiscount: 0,//会员折扣
      groupDiningEventId: "", //TODO 保留字段
      appointmentTime: "", //TODO 保留字段
      isTakeAway: false, //是否是外卖
      minimalBillFee: 0,//外卖起送费
      takeAwayTime: "", //外卖时间 
      selectedAddress: {},//选择地址
      shippingAddressId: "", //配送地址对应id
      shippingFee: 0, //配送费
      mealType: "",//就餐模式
      onlyForPay: false,
      peopleCount: 1, //就餐人数
      tableId: "", //桌台id
      tableName: "", //桌台名称
      couponPackageId: "",//券包合并支付的id
      couponPackagePrice: "",//券包合并支付券包的价格
      isBuyCouponPackage: false, //是否开启券包合并支付
      selCouponReduceCost: 0, //使用券包的价格
      selCouponId: "",//使用券包的id
      isAgreeCouponAccord: true, //是否统一付费券包协议
      selRechargeInfo: {},
    },
    orderFanpiaoPayInfo: {
      fanpiaoPaidFee: 0,
      fanpiaoRemainPaidFee: 0,
      recommendFanpiaoList: [],
      selFanpiaoId: "",
      selFanpiaoInfo: "",
    },
    orderRechargeInfo: {
      recommendRechargeList: [],
      selRechargeId: "",
      selRechargeInfo: {},
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
        } else if ((fanpiaoRemainPaidFee > 0 && !selFanpiaoId)) {
          return state.orderInfo.billFee;
        } else {//余额够
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
    },
    setOrderRechargeInfo(state, orderRechargeInfo) {
      for (let key in orderRechargeInfo) {
        state.orderRechargeInfo[key] = orderRechargeInfo[key];
      }
    }
  },
  actions: {

  }
}
/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:02:54
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:33
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/orderHooks.js
 */
import { computed, ref, reactive, unref } from 'vue';
import { getDishInfoById, showToast, formatTime, transformDetailDishList } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
const orderDefaultInfo = {
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
  takeAwayTime: "", //外卖时间 
  selectedAddress: {},//选择地址
  shippingAddressId: "", //配送地址对应id
  shippingFee: 0,
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
}

export function useOrder() {

  const { merchantInfo } = useState('merchant', ["merchantInfo"])
  const { orderInfo, payMethod } = useState("order", ["orderInfo", "payMethod"])
  const { selectedDishes } = useState("menu", ["selectedDishes"])
  const { setPayMethod, setOrderInfo } = useMutations("order", ["setPayMethod", "setOrderInfo"]);
  const { phone } = useState('user', ['phone']);

  function handleKeruyunSkuDish(selectedDishes) {
    let attrDishMap = getApp().globalData.attrDishMap || {}
    selectedDishes.forEach(dishInfo => {
      dishInfo = unref(dishInfo)
      if (dishInfo.attrs) {
        dishInfo.attrs.forEach((attr) => {
          let attrId = dishInfo.name + attr.id
          if (attrId in attrDishMap) {
            let realDish = attrDishMap[attrId]
            dishInfo.id = realDish.id
            dishInfo.originPrice = realDish.originPrice
            dishInfo.marketPrice = realDish.marketPrice
            dishInfo.discountPrice = realDish.discountPrice
            dishInfo.price = realDish.price
          }
        })
      }
    })

    return selectedDishes
  }
  async function createOrder(args = {}) {

    let orderInfoTemp = unref(orderInfo);
    let { mealType, selectedAddress, shippingFee } = orderInfoTemp;
    let orderArgs = {
      dishList: handleKeruyunSkuDish(unref(selectedDishes)),
      mealType: orderInfoTemp.mealType,
      shippingAddressId: orderInfoTemp.id || '',
      shippingFee: orderInfoTemp.shippingFee || 0,
      tableId: orderInfoTemp.tableId,
      remark: orderInfoTemp.remark,
      peopleCount: Number(orderInfoTemp.peopleCount || 1),
      groupDiningEventId: orderInfoTemp.groupDiningEventId,
      phone: orderInfoTemp.phone || unref(phone),
      appointmentTime: orderInfoTemp.takeAwayTime || '',
      discountAmountPrice: 0,
      ...args
    }
    orderArgs.dishList = JSON.parse(JSON.stringify(orderArgs.dishList));
    if (orderArgs.dishList) {
      orderArgs.dishList.forEach(dishItem => {
        if (dishItem.childDishes && dishItem.childDishes.length > 0) {
          dishItem.childDishGroups.forEach(groupItem => {
            if (groupItem.childDishes && groupItem.childDishes.length > 0) {
              groupItem.childDishes.forEach(groupChildDishItem => {
                groupChildDishItem.quantity = (groupChildDishItem.quantity * dishItem.quantity);
              })
            }
          })
        }
      })
    }
    if (mealType == "TAKE_OUT") {
      orderArgs.shippingAddressId = selectedAddress.id;
      orderArgs.shippingFee = shippingFee;
    }

    let res = await API.Order.createOrder(unref(merchantInfo).merchantId, orderArgs);;
    if (!res?.orderId && (res.errcode != 220012 && res.errmsg)) {
      showToast(res.errmsg)
    } else if (res.errcode == 220012) {
      return {
        confirmOrder: true
      }
    }
    return res?.orderId;
  }

  async function addOrder(orderId, dishList) {
    let params = {
      dishList,
      orderId,
      remark: ""
    };

    let addRes = API.Order.addOrder(params);
    return addRes

  }


  async function resetOrder() {
    setOrderInfo({
      pendingOrderId: "",
      penddingOrderDishList: [],
      currentType: "CREATE",
      orderId: "",//订单id
      remark: "",//订单备注
      billFee: 0,//账单金额
      packageFee: 0,//打包费
      discountAmountPrice: 0, //菜品折扣已优惠的价格
      groupDiningEventId: "", //TODO 保留字段
      appointmentTime: "", //TODO 保留字段
      couponPackageId: "",//券包合并支付的id
      couponPackagePrice: "",//券包合并支付券包的价格
      isBuyCouponPackage: false, //是否开启券包合并支付
      selCouponReduceCost: 0, //使用券包的价格
      selCouponId: "",//使用券包的id
      isAgreeCouponAccord: true, //是否统一付费券包协议
      selRechargeInfo: {},
    })
  }



  return {
    payMethod,
    orderInfo,
    createOrder,
    setPayMethod,
    setOrderInfo,
    addOrder,
    resetOrder
  }
}

export function useOrderRecord() {

  const orderList = ref([]), fanpiaoList = ref([]), couponList = ref([]), moreOrder = {}, moreFanpiao = {}, moreCoupon = {};
  let orderParams = {
    hasMore: true,
  }, fanpiaoParams = {
    hasMore: true,
  }, couponParams = {
    hasMore: true,
  };

  async function getOrderList(first = true) {
    if (!orderParams.hasMore) {
      return;
    }
    let res = await API.Order.getOrderList(orderParams) || { orders: [] };
    let { hasMore, latestTime, orders } = res;
    orderList.value = orderList.value.concat(orders);
    orderParams = {
      hasMore,
      latestTime
    }

  }

  async function getFanpiaoRecordList(first = true) {
    if (!fanpiaoParams.hasMore) {
      return;
    }
    let res = await API.Order.getFanpiaoList(fanpiaoParams) || { fanpiaos: [] };
    let { hasMore, latestTime, fanpiaos } = res;
    fanpiaoList.value = fanpiaoList.value.concat(fanpiaos);
    fanpiaoParams = {
      hasMore,
      latestTime
    }

  }


  async function getCouponRecordList(first = true) {
    if (!couponParams.hasMore) {
      return;
    }
    let res = await API.Order.getCouponList(couponParams) || { couponPackages: [] };
    let { hasMore, latestTime, couponPackages } = res;
    couponList.value = couponList.value.concat(couponPackages);
    couponParams = {
      hasMore,
      latestTime
    }

  }

  async function refundFanpiao(transactionId, args) {
    let res = await API.Order.refundFanpiao(transactionId, args)
    showToast('饭票退款成功')
    if (res.errcode == 0) {
      fanpiaoList.value.forEach(item => {
        if (item.transactionId == transactionId) {
          item.status = "REFUND"
          item.canRefund = false;
        }
      })
    }

  }

  async function refundCoupon(transactionId, args) {
    let res = await API.Order.refundCoupon(transactionId, args)
    showToast('券包退款成功')
    if (res.errcode == 0) {
      couponList.value.forEach(item => {
        if (item.transactionId == transactionId) {
          item.status = "REFUND";
          item.canRefund = false;
        }
      })
    }
  }

  return {
    orderList,
    fanpiaoList,
    couponList,
    getOrderList,
    getFanpiaoRecordList,
    getCouponRecordList,
    refundFanpiao,
    refundCoupon
  }
}

export function useOrderDetail() {
  const orderDetail = ref({
    storeName: "",
    dishList: [],
    billFee: 0,
    paidFee: 0,
  });

  async function getOrderDetailById(orderId) {
    if (!orderId) { return };
    let orderInfoRes = await API.Order.getOrderDetailById(orderId) || {};
    // 待付款订单处理菜品信息
    if (orderInfoRes) {
      transformDetailDishList(orderInfoRes)
      let curBatchNum = 1;
      let dishListMap = {} //处理套餐的总价
      orderInfoRes.dishList.forEach((item, index) => {
        if (!item.isChildDish) {
          dishListMap[item.uuid] = item;
        } else if (item.parentUuid && dishListMap[item.parentUuid]) {
          dishListMap[item.parentUuid].totalFee += item.totalFee;
        }

        if (index > 0) {
          if (item.batchNumber != curBatchNum) {
            curBatchNum = item.batchNumber;
          } else {
            item.batchNumber = -1;
          }
        }
        item.createTimeText = formatTime(item.createTime, 'hh:mm');
      })
    }

    orderDetail.value = orderInfoRes;
    return orderInfoRes;
  }

  return {
    orderDetail,
    getOrderDetailById,
  }
}

export function usePayMethod() {
  const { payMethod } = useState('order', ["payMethod"]);
  const { setPayMethod } = useMutations("order", ["setPayMethod"])
  return {
    payMethod,
    setPayMethod
  }
}

export function useFanpiaoPayInfo() {
  const { orderFanpiaoPayInfo } = useState('order', ["orderFanpiaoPayInfo"]);
  const { finalFanpiaoPaidFee } = useGetters('order', ["finalFanpiaoPaidFee"]);
  const { setOrderFanpiaoPayInfo } = useMutations("order", ["setOrderFanpiaoPayInfo"])
  return {
    orderFanpiaoPayInfo,
    finalFanpiaoPaidFee,
    setOrderFanpiaoPayInfo
  }
}

export function useOrderRechargeInfo() {
  const { orderRechargeInfo } = useState('order', ["orderRechargeInfo"]);
  const { setOrderRechargeInfo } = useMutations("order", ["setOrderRechargeInfo"])
  return {
    orderRechargeInfo,
    setOrderRechargeInfo
  }
}

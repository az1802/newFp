/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:02:54
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:33
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/orderHooks.js
 */
import { computed, ref, reactive, unref } from 'vue';
import { getDishInfoById, showToast, formatTime } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";

export function useOrder() {

  const { merchantInfo } = useState('merchant', ["merchantInfo"])
  const { orderInfo, payMethod } = useState("order", ["orderInfo", "payMethod"])
  const { selectedDishes } = useState("menu", ["selectedDishes"])
  const { setPayMethod, setOrderInfo } = useMutations("order", ["setPayMethod", "setOrderInfo"]);
  const { phone } = useState('user', ['phone']);
  async function createOrder() {
    let orderInfoTemp = unref(orderInfo);
    let orderArgs = {
      dishList: unref(selectedDishes),
      mealType: orderInfoTemp.mealType,
      shippingAddressId: orderInfoTemp.id || '',
      shippingFee: orderInfoTemp.shippingFee || 0,
      tableId: orderInfoTemp.tableId,
      remark: orderInfoTemp.remark,
      peopleCount: Number(orderInfoTemp.peopleCount || 1),
      groupDiningEventId: orderInfoTemp.groupDiningEventId,
      phone: unref(phone),
      appointmentTime: orderInfoTemp.takeawayTime || '',
      discountAmountPrice: 0,
    }
    let res = await API.Order.createOrder(unref(merchantInfo).merchantId, orderArgs);;
    return res?.orderId;
  }


  return {
    payMethod,
    orderInfo,
    createOrder,
    setPayMethod,
    setOrderInfo
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
    console.log('orderInfoRes: ', orderInfoRes);
    // 待付款订单处理菜品信息
    if (orderInfoRes && orderInfoRes.status != 'PAID') {
      let curBatchNum = 0;
      orderInfoRes.dishList.forEach(item => {
        if (item.batchNumber != curBatchNum) {
          curBatchNum = item.batchNumber;
        } else {
          item.batchNumber = -1;
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
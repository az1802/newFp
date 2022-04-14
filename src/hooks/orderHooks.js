/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:02:54
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:33
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/orderHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { getDishInfoById, showToast } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";




export function useOrder() {

  const { merchantInfo } = useState('merchant', ["merchantInfo"])
  const { orderInfo, payMethod } = useState("order", ["orderInfo", "payMethod"])
  const { selectedDishes } = useState("menu", ["selectedDishes"])
  const { setPayMethod, setOrderInfo } = useMutations("order", ["setPayMethod", "setOrderInfo"])
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
      phone: "17688479248",
      appointmentTime: orderInfoTemp.takeawayTime || '',
      discountAmount: 0,
    }
    let res = await API.Order.createOrder(unref(merchantInfo).merchantId, orderArgs);;
    return res?.orderId;
  }


  async function payOrder() {

  }



  return {
    payMethod,
    orderInfo,
    createOrder,
    payOrder,
    setPayMethod,
    setOrderInfo
  }
}

export function useOrderRecord() {

  const orderInfo = ref({}), orderList = ref([]), fanpiaoList = ref([]), couponList = ref([]), moreOrder = {}, moreFanpiao = {}, moreCoupon = {};
  async function getOrderDetailById(orderId) {
    if (!orderId) { return };
    let orderInfoRes = await API.Order.getOrderDetailById(orderId) || {};
    orderInfo.value = orderInfoRes;
  }

  async function getOrderList(first = false) {
    let res = await API.Order.getOrderList() || { orders: [] };
    let { hasMore, latestTime, orders } = res;
    orderList.value = orders;
    if (hasMore) {
      moreOrder = {
        hasMore,
        latestTime
      }
    }

  }

  async function getFanpiaoRecordList(first = false) {
    let res = await API.Order.getFanpiaoList() || { fanpiaos: [] };
    let { hasMore, latestTime, fanpiaos } = res;
    fanpiaoList.value = fanpiaos;
    if (hasMore) {
      moreFanpiao = {
        hasMore,
        latestTime
      }
    }

  }
  async function getCouponRecordList(first = false) {
    let res = await API.Order.getCouponList() || { couponPackages: [] };
    let { hasMore, latestTime, couponPackages } = res;
    couponList.value = couponPackages;
    if (hasMore) {
      moreCoupon = {
        hasMore,
        latestTime
      }
    }

  }



  async function refundFanpiao(transactionId, args) {
    let res = await API.User.refundFanpiao(transactionId, args)
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
    let res = await API.User.refundCoupon(transactionId, args)
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
    orderInfo,
    orderList,
    fanpiaoList,
    couponList,
    getOrderDetailById,
    getOrderList,
    getFanpiaoRecordList,
    getCouponRecordList,
    refundFanpiao,
    refundCoupon
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
/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:02:54
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:23:33
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/orderHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { getDishInfoById } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";




export function useOrder() {

  let merchantId = "4146f4810c74424b819d7fcfb84826e8";
  const { orderInfo, payMethod } = useState("order", ["orderInfo", "payMethod"])
  const { selectedDishes } = useState("menu", ["selectedDishes"])
  const { setPayMethod } = useMutations("order", ["setPayMethod"])
  async function createOrder() {
    let orderArgs = {
      dishList: unref(selectedDishes),
      groupDiningEventId: "",
      mealType: "TAKE_AWAY",
      peopleCount: 1,
      phone: "17688479248",
      remark: "",
      shippingAddressId: "",
      shippingFee: 0,
      tableId: "5c77abcc369d408d96e61a3583022dcd",
      appointmentTime: "",
      discountAmount: 0,
    }
    let res = await API.Order.createOrder(merchantId, orderArgs);;
    return res;
  }


  async function payOrder() {

  }



  return {
    payMethod,
    orderInfo,
    createOrder,
    payOrder,
    setPayMethod
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



  return {
    orderInfo,
    orderList,
    fanpiaoList,
    couponList,
    getOrderDetailById,
    getOrderList,
    getFanpiaoRecordList,
    getCouponRecordList


  }
}
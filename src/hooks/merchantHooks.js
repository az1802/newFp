/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:06
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:14:49
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/merchantHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { sleep, handleDishList, getStorage, getDishInfoById, showToast } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
import order from '../state/modules/order';
const {
  getDishCatalogScene,
  getMerchantInfo,
  getMerchantDishCategory,
  getFanpiaoList,
  getCouponList,
  getFanpiaoPlatformRecords
} = API.Merchant;


export function useMerchantInfo() {
  const { setMerchantInfo } = useMutations("merchant", ["setMerchantInfo", "merchantInfo"]);
  const { setPackagingBoxConfig, setRequiredOrderItems } = useMutations("menu", ["setPackagingBoxConfig", "setRequiredOrderItems"]);
  const { merchantInfo } = useState("merchant", ['merchantInfo']);
  const { setOrderInfo } = useMutations('order', ['setOrderInfo'])
  async function requestMerchantInfo(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getMerchantInfo(merchantId);
    setMerchantInfo(res);
    setPackagingBoxConfig({ //设置打包费配置
      packageBoxType: res.packageBoxType
    })
    uni.setStorageSync("merchantInfo", res);
    uni.setStorageSync("merchantId", res.merchantId);
    return res;
  }
  async function requestMerchantDishes(merchantId) {
    if (!merchantId) { return };
    let dishesRes = await API.Merchant.getMerchantDishCategory(merchantId);
    // setPackagingBoxConfig({ //TODO 打包费模块暂时不处理
    //   packageBoxDishPrice: dishesRes.packagingBoxConfig?.dish?.price || 0
    // }) 
    // 处理必选菜
    if (dishesRes.requiredOrderItems?.length > 0) {
      setRequiredOrderItems(dishesRes.requiredOrderItems);
    }
    if (dishesRes.minimalBillFee) {
      setOrderInfo({
        minimalBillFee: dishesRes.minimalBillFee,
        shippingFee: dishesRes.shippingFee
      })
    }


    let dishBaseSellCountMap = await API.Merchant.getDishSoldNumber(merchantId);
    let dishListRes = handleDishList(dishesRes.dishes, dishBaseSellCountMap);

    return dishListRes;
  }
  return {
    merchantInfo, setMerchantInfo, requestMerchantInfo, requestMerchantDishes
  }
}

// let merchantId = '1e543376139b474e97d38d487fa9fbe8';
export function useFanpiaoInfo() {
  const { setFanpiaoList, setFanpiaoUserList, setFanpiaoUserNum } = useMutations("merchant", ["setFanpiaoList", "setFanpiaoUserList", "setFanpiaoUserNum"]);
  const { fanpiaoList, fanpiaoUserAvaterList, fanpiaoUserNum } = useState("merchant", ['fanpiaoList', "fanpiaoUserAvaterList", 'fanpiaoUserNum']);
  async function requestFanpiaoList(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getFanpiaoList(merchantId)
    setFanpiaoList(res || []);
  }
  async function requestFanpiaoPlatformRecords() {
    let res = await getFanpiaoPlatformRecords()
    if (res) {
      setFanpiaoUserList(res.headImageUrls);
      setFanpiaoUserNum(res.purchaseCount)
    }
  }
  return {
    fanpiaoList,
    fanpiaoUserNum,
    fanpiaoUserAvaterList,
    ...useGetters("merchant", [
      "maxDiscountFanpiao",
      "minDiscountFanpiao",
    ]),
    requestFanpiaoList,
    setFanpiaoList,
    requestFanpiaoList,
    requestFanpiaoPlatformRecords,
  }
}
export function useCouponInfo() {
  const { setCouponList } = useMutations("merchant", ["setCouponList"]);
  const { couponList } = useState("merchant", ['couponList']);

  async function requestCouponList(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getCouponList(merchantId);
    if (!res.couponPackages) {
      return;
    }
    for (let key in res.couponPackages) {
      res.couponPackages[key].availableFee = parseFloat(key)
      res.couponPackages[key].couponCost = res.couponPackages[key]?.coupons[0]?.reduceCost || 0;
    }
    setCouponList(Object.values(res.couponPackages));
  }

  return { couponList, setCouponList, requestCouponList }
}

export function useRefund() {
  async function refundFanpiaoApply(fanpiaoInfo) {
    let res = await API.Merchant.refundFanpiaoApply(fanpiaoInfo)
    return res;
  }
  return {
    refundFanpiaoApply
  }
}

export function useDishList() {

}

export function useFanpiaoOpenScreen() {

  let { showFanpiaoOpenScreenModal } = useState('menu', ["showFanpiaoOpenScreenModal"]);
  let { toggleShowFanpiaoOpenScreenModal } = useMutations('menu', ["toggleShowFanpiaoOpenScreenModal"])
  let { fanpiaoList } = useState('merchant', ["fanpiaoList"]);
  let { setFanpiaoList } = useMutations('merchant', ["setFanpiaoList"]);

  // (async function () {
  //   if (unref(fanpiaoList).length == 0) {
  //     let merchantId = uni.getStorageSync("merchantId");
  //     if (merchantId) {
  //       let res = await getFanpiaoList(merchantId)
  //       setFanpiaoList(res);
  //     }
  //   }
  // })()

  async function requestBuyFanpiaoRecord() {
    let merchantId = uni.getStorageSync("merchantId");
    let res = await API.Merchant.getFanpiaoBuyRecord(merchantId);
    if (Array.isArray(res)) {
      return res
    } else {
      return []
    }
  }

  return {
    showFanpiaoOpenScreenModal,
    toggleShowFanpiaoOpenScreenModal,
    requestBuyFanpiaoRecord,
    fanpiaoList
  }
}

export function useRecommendationDish() {
  let { recommendedDishes } = useState('menu', ["recommendedDishes"]);
  let { setRecommendedDishes } = useMutations('menu', ["setRecommendedDishes"])

  async function requestRecommendDishes(merchantId) {
    let res = await API.Merchant.getRecommendedDishes(merchantId)
    setRecommendedDishes(res?.dishes || []);
  }

  return {
    recommendedDishes,
    requestRecommendDishes
  }
}


export function useRechargeInfo() {
  const { rechargeConfigs } = useState('merchant', ["rechargeConfigs"]);
  const { setRechargeConfigs } = useMutations('merchant', ["setRechargeConfigs"]);


  async function requestMerchantRecharges(merchantId) {
    let rechargeList = await API.Merchant.getRechargeConfigs(merchantId);
    (rechargeList instanceof Array) && setRechargeConfigs(rechargeList)
  }


  return {
    requestMerchantRecharges,
    rechargeConfigs
  }
}


export function useMerchantOrderRecord(merchantId) {

  const orderList = ref([]), fanpiaoList = ref([]), couponList = ref([]), moreOrder = {}, moreFanpiao = {}, moreCoupon = {};

  let orderParams = {}, fanpiaoParams = {}, couponParams = {};
  async function getOrderRecordList(first = true) {
    let res = await API.Merchant.getOrderRecordList(merchantId, orderParams) || { orders: [] };
    let { hasMore, latestTime, orders = [] } = res;
    orderList.value = orderList.value.concat(orders);
    if (hasMore) {
      orderParams = {
        hasMore,
        latestTime
      }
    }

  }

  async function getFanpiaoRecordList(first = true) {
    let res = await API.Merchant.getFanpiaoRecordList(merchantId, fanpiaoParams) || { fanpiaos: [] };
    let { hasMore, latestTime, fanpiaos = [] } = res;
    fanpiaoList.value = fanpiaoList.value.concat(fanpiaos);
    if (hasMore) {
      fanpiaoParams = {
        hasMore,
        latestTime
      }
    }

  }

  async function getCouponRecordList(first = true) {
    let res = await API.Merchant.getCouponRecordList(merchantId, couponParams) || { couponPackages: [] };
    let { hasMore, latestTime, couponPackages = [] } = res;
    couponList.value = couponList.value.concat(couponPackages);
    if (hasMore) {
      couponParams = {
        hasMore,
        latestTime
      }
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
    getOrderRecordList,
    getFanpiaoRecordList,
    getCouponRecordList,
    refundFanpiao,
    refundCoupon
  }
}


export function useRequiredOrderItems() {
  const { requiredOrderItems, selectedDishes } = useState('menu', ["requiredOrderItems", "selectedDishes"]);
  const { orderInfo } = useState('order', ['orderInfo']);
  const { merchantInfo } = useState('merchant', ["merchantInfo"])
  let {
    addSelDish,
    reduceSelDish,
    resetSelectedDishes,
    saveSelectedDishesStorage } = useMutations("menu", [
      "addSelDish",
      "reduceSelDish",
      "resetSelectedDishes",
      "saveSelectedDishesStorage"
    ]);

  async function addRequiredOrderItems() {
    let { peopleCount } = unref(orderInfo);
    const { recentlyPaidOrderId, recentlyOrderId } = unref(merchantInfo);
    let requireArr = [], removeArr = [];

    if (!recentlyPaidOrderId && !recentlyOrderId) {//没有最近的订单则设置添加必选菜
      unref(requiredOrderItems).forEach(item => {
        let quantity = 1;
        if (item.type === 'EVERYONE') {
          quantity = peopleCount
        }
        let temp = Object.assign({}, item, { isRequired: true, quantity, minSel: quantity })
        console.log('temp: ', temp);
        requireArr.push(temp);
      })
    }


    // 处理配送费相关的问题
    let takeOutDishItem;
    let allDishes = getApp().globalData.allDishes;
    for (let i = 0; i < allDishes.length; i++) {
      if (allDishes[i].name == "配送费") {
        takeOutDishItem = allDishes[i];
        takeOutDishItem.minSel = 1;
        takeOutDishItem.isRequired = true;
        takeOutDishItem.quantity = 1;
        break;
      }
    }

    if (unref(orderInfo).mealType == "TAKE_OUT" && takeOutDishItem) {
      requireArr.push(takeOutDishItem);
    } else { //其它模式一处配送费
      let index = unref(selectedDishes).findIndex(item => {
        return item.name == "配送费";
      })
      index != -1 && unref(selectedDishes).splice(index, 1)
    }

    requireArr.forEach(requireItem => {
      let index = unref(selectedDishes).findIndex(item => {
        return item.id == requireItem.id
      })
      let selDishItem = unref(selectedDishes)[index];

      if (index != -1 && requireItem.minSel > selDishItem.quantity) { //校验数量
        let addTemp = Object.assign({}, requireItem, { quantity: requireItem.minSel - selDishItem.quantity });
        addSelDish(addTemp)
      } else if (index == -1) {
        addSelDish(requireItem)
      }
    })

  }
  return {
    addRequiredOrderItems
  }
}

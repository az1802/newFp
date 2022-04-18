/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:06
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:14:49
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/merchantHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { sleep, handleDishList, getStorage, getDishInfoById } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
const {
  getDishCatalogScene,
  getMerchantInfo,
  getMerchantDishCategory,
  getFanpiaoList,
  getCouponList,
  getFanpiaoPlatformRecords
} = API.Merchant;

let mockMerhantId = '1e543376139b474e97d38d487fa9fbe8';

export function useMerchantInfo() {
  const { setMerchantInfo } = useMutations("merchant", ["setMerchantInfo"]);
  const { setPackagingBoxConfig } = useMutations("menu", ["setPackagingBoxConfig"]);
  const { merchantInfo } = useState("merchant", ['merchantInfo']);
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
    setPackagingBoxConfig({ //设置打包费配置
      packageBoxDishPrice: dishesRes.packagingBoxConfig?.dish?.prce || 0
    })
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
    setFanpiaoList(res);
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
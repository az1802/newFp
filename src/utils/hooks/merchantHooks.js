/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:06
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:14:49
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/merchantHooks.js
 */
import { computed, ref, reactive } from 'vue'
import { getDishInfoById } from "@utils/common.js";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
const {
  getDishCatalogScene,
  getMerchantInfo,
  getMerchantDishCategory,
  getFanpiaoList,
  getCouponList,
} = API.Merchant;


export function useMerchantInfo() {
  const { setMerchantInfo } = useMutations("merchant", ["setMerchantInfo"]);
  async function requestMerchantInfo(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getMerchantInfo(merchantId);
    setMerchantInfo(res);
  }
  return {
    ...useState("merchant", ['merchantInfo']), setMerchantInfo, requestMerchantInfo
  }
}

export function useFanpiaoInfo() {
  const { setFanpiaoList } = useMutations("merchant", ["setFanpiaoList"]);
  async function requestFanpiaoList(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getFanpiaoList(merchantId)
    setFanpiaoList(res);
  }
  return {
    ...useState("merchant", ['fanpiaoList']),
    ...useGetters("merchant", [
      "maxDiscountFanpiao",
    ]),
    setFanpiaoList,
    requestFanpiaoList
  }
}

export function useCouponInfo() {
  const { setCouponList } = useMutations("merchant", ["setCouponList"]);
  async function requestCouponList(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getCouponList(merchantId)
    setCouponList(res.couponPackages);
  }
  return { ...useState("merchant", ['couponInfo']), setCouponList, requestCouponList }
}



export function useDishList() {

}
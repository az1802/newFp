/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:06
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:14:49
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/merchantHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { getDishInfoById } from "@utils";
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
  const { merchantInfo } = useState("merchant", ['merchantInfo']);
  if (Object.keys(unref(merchantInfo)).length == 0) {
    requestMerchantInfo()
  }

  async function requestMerchantInfo(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getMerchantInfo(merchantId);
    setMerchantInfo(res);
  }
  return {
    merchantInfo, setMerchantInfo, requestMerchantInfo
  }
}


let merchantId = '1e543376139b474e97d38d487fa9fbe8';
export function useFanpiaoInfo() {
  const { setFanpiaoList, setFanpiaoUserList, setFanpiaoUserNum } = useMutations("merchant", ["setFanpiaoList", "setFanpiaoUserList", "setFanpiaoUserNum"]);
  const { fanpiaoList, fanpiaoUserAvaterList, fanpiaoUserNum } = useState("merchant", ['fanpiaoList', "fanpiaoUserAvaterList", 'fanpiaoUserNum']);

  // if (!fanpiaoList?.value?.length) {
  //   requestFanpiaoList(merchantId);
  // }
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
  const { couponList } = useState("merchant", ['couponList'])
  // if (!couponInfo?.value?.length) {
  //   requestCouponList(merchantId)
  // }
  async function requestCouponList(merchantId) {
    if (!merchantId) {
      return;
    }
    let res = await getCouponList(merchantId)
    setCouponList(Object.values(res.couponPackages));
  }

  function calcRightCoupon(BillFee) {

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
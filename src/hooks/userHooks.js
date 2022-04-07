/*
 * @Author: sunjie
 * @Date: 2022-02-18 17:53:39
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:50:54
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/userHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";


export function useUserInfo() {

  const { userInfo, stats, userId, userWallet, userFanpiaoRecords } = useState("user", ['userInfo', "stats", "userId", "userWallet", "userFanpiaoRecords"])
  const { setUserInfo, setStats, setUserWallet, setUserFanpiaoRecords } = useMutations("user", ["setUserInfo", "setStats", "setUserWallet", "setUserFanpiaoRecords"]);

  async function requestUserInfo() {
    // let userId = uni.getStorageSync("userId");
    // if (!userId) {
    //   return;
    // }
    let res = await API.User.getUserInfo();
    if (res) {
      const { alipayProfile = {}, memberProfile, id, wechatProfile } = res.user;
      let userInfoData = {
        userId: res.id,
        avatarUrl: wechatProfile.headimgurl || memberProfile.headimgurl,
        nickName: wechatProfile.nickname || memberProfile.nickname,
      }
      setUserInfo(userInfoData);
    }

  }
  async function requestUserStats() {
    // let userId = uni.getStorageSync("userId");
    // if (!userId) {
    //   return;
    // }
    let res = await API.User.getUserSavingStats();
    setStats(res.stats);
  }
  async function requestUserWallet() {
    // let userId = uni.getStorageSync("userId");
    // if (!userId) {
    //   return;
    // }
    let res = await API.User.getUserWallet();
    setUserWallet(res)
  }

  async function requestUserFanpiaoRecords() {
    // let userId = uni.getStorageSync("userId");
    // if (!userId) {
    //   return;
    // }
    let res = await API.User.getUserFanpiaoRecords();
    setUserFanpiaoRecords(res.fanpiaos || [])
  }








  return {
    userInfo,
    userId,
    stats,
    userWallet,
    userFanpiaoRecords,
    requestUserInfo,
    requestUserStats,
    requestUserWallet,
    requestUserFanpiaoRecords,
  }
}


const PAGE = 1;
const SIZE = 100
export function useUserCoupon() {


  let merchantCoupons = ref([]), usedCouponList = ref([]), expiredCouponList = ref([]);

  async function requestUserMerchantCoupon(merchantId) {
    let res = await API.User.getUserMerchantCoupon(merchantId)
    if (res.errcode == 0) {
      return res.data || []
    }
    return []
  }
  async function requestUsedCouponList() {
    let acceptData = {
      page: PAGE,
      size: SIZE,
      state: "USED",
    };
    let res = await API.User.getUserOwnCouponList({ data: acceptData });
    if (res.errcode == 0) {
      return res.data || []
    }
    return []
  }
  async function requestExpiredCouponList() {
    let acceptData = {
      page: PAGE,
      size: SIZE,
      state: "EXPIRED",
    };
    let res = await API.User.getUserOwnCouponList({ data: acceptData });
    if (res.errcode == 0) {
      return res.data || []
    }
    return []
  }





  return {
    merchantCoupons,
    usedCouponList,
    expiredCouponList,
    requestUserMerchantCoupon,
    requestUsedCouponList,
    requestExpiredCouponList,
  }
}

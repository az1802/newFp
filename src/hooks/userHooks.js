/*
 * @Author: sunjie
 * @Date: 2022-02-18 17:53:39
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:50:54
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/userHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import { reLaunch } from "@utils"
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


  async function getUserMerchantInfo(merchantId) {
    let res = await API.User.getUserMerchantInfo(merchantId)
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
    getUserMerchantInfo
  }
}

export function userMerchantInfo() {




  return {

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

// 处理用户包含的商户券包
export function useUserMerchantCoupon() {
  let { userMerchantCoupons } = useState('user', ["userMerchantCoupons"]);
  let { setUserMerchantCoupons } = useMutations('user', ["setUserMerchantCoupons"]);

  async function requestUserMerchantCoupons(merchantId) {
    let res = await API.User.getUserMerchantCoupon(merchantId)
    setUserMerchantCoupons(res?.coupons || [])
    return res.coupons;
  }






  return {
    userMerchantCoupons,
    requestUserMerchantCoupons,
  }
}

export function useUserLogin() {
  async function checkLogin() {
    let userId = uni.getStorageSync('userId') || "";
    if (!userId) {
      let res = await reLaunch("MENU/LOGIN")
      return ''
    }
    return userId;
  }
  async function login() {

  }
  return {
    checkLogin,
    login
  }
}

// 获取和设置用户手机号
export function useUserPhone() {

  let { phone } = useState('user', ["phone"]);
  let { setPhone } = useMutations('user', ["setPhone"]);
  return {
    phone,
    setPhone
  }

}

// 处理用户外卖地址(增删改查)
export function useUserAddress() {

  const { userAddressList } = useState('user', ["userAddressList"]);
  const { setUserAddressList } = useMutations('user', ["setUserAddressList"]);

  async function requestUserAddressList() {
    let res = await API.User.getUserProfile();
    setUserAddressList(res?.userInfo?.memberProfile?.shippingAddress || [])
  }

  async function addAddress(addressInfo) {
    let res = await API.User.addShippingAddress(addressInfo);
    return res;
  }
  async function updateAddress(addressInfo) {
    let res = await API.User.updateAddressDetail(addressInfo);
    if (res) {
      requestUserAddressList()
    }
    return res;
  }
  async function getAddressDetail(addressId) {
    let res = await API.User.getAddressDetail(addressId);
    if (res) {
      requestUserAddressList()
    }
    return res;
  }

  return {
    userAddressList,
    setUserAddressList,
    requestUserAddressList,
    addAddress,
    updateAddress,
    getAddressDetail
  }

}


export function useUserWallet() {
  let { userWallet } = useState('user', ["userWallet"]);
  let { setUserWallet } = useMutations('user', ["setUserWallet"]);

  async function requestUserWallet(merchantId) {
    API.User.getUserMemberBalance(merchantId).then(({ balance }) => {
      setUserWallet({
        "memberCardBalance": balance || 0,
      })
    });

    API.User.getUserFanpiaoBalance(merchantId).then(({ balance }) => {
      setUserWallet({
        fanpiaoBalance: balance || 0
      })
    });
    API.User.getUserWallet().then(({ balance }) => {
      setUserWallet({
        redPacketBalance: balance || 0
      })
    });

    let res = await API.User.getUserFanpiaoPaidFee({
      merchantId,
      billFee: 10000 * 100,
      noDiscountFee: 0
    })
    setUserWallet({
      fanpiaoPaidFee: res?.paidFee || 0
    })

  }
  async function requestFanpiaoPaidFee(merchantId, billFee = 10000 * 100) {
    let res = await API.User.getUserFanpiaoPaidFee({
      merchantId,
      billFee,
      noDiscountFee: 0
    });

    return res;
  }



  return {
    userWallet,
    requestUserWallet,
    requestFanpiaoPaidFee
  }
}
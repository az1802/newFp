/*
 * @Author: sunjie
 * @Date: 2022-02-18 17:53:39
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:50:54
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/userHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import { reLaunch, wechatSignUp, aliSignUp, navigateTo } from "@utils"
import API from "@api";

export function useUserInfo() {
  let { userInfo, userId, userWallet } = useState("user", ['userInfo', "userId", "userWallet"])
  const { setUserInfo, setStats, setUserWallet, setUserId } = useMutations("user", ["setUserInfo", "setUserWallet", 'setUserId']);
  const { setOrderInfo } = useMutations('order', ["setOrderInfo"])
  if (uni.getStorageSync('userId')) {
    setUserId(userId);
  }
  async function requestUserInfo() {
    let userId = uni.getStorageSync("userId");
    if (!userId) {
      return;
    }
    let res = await API.User.getUserInfo();
    if (res) {
      const { alipayProfile = {}, memberProfile, id, wechatProfile = {} } = res.user;
      let userInfoData = {
        userId: res.id,
        avatarUrl: wechatProfile.headimgurl || memberProfile.headimgurl,
        nickName: wechatProfile.nickname || memberProfile.nickname,
      }
      setUserInfo(userInfoData);
    }

  }

  async function requestUserWallet() {
    let res = await API.User.getUserWallet();
    setUserWallet(res)
  }

  async function getUserMerchantInfo(merchantId) {
    let res = await API.User.getUserMerchantInfo(merchantId);
    if (res) {
      setUserInfo(res);
      setOrderInfo({
        phoneMemberDiscount: res.phoneMemberDiscount
      })
    }
  }


  return {
    userInfo,
    userId,
    userWallet,
    requestUserInfo,
    requestUserWallet,
    getUserMerchantInfo
  }
}

export function useUserFanpiaoRecords() {
  const { userFanpiaoRecords } = useState("user", ["userFanpiaoRecords"]);
  const { setUserFanpiaoRecords } = useMutations("user", ["setUserFanpiaoRecords"]);

  async function requestUserFanpiaoRecords() {
    // let userId = uni.getStorageSync("userId");
    // if (!userId) {
    //   return;
    // }
    let res = await API.User.getUserFanpiaoRecords();
    setUserFanpiaoRecords(res.fanpiaos || [])
  }
  return {
    userFanpiaoRecords,
    requestUserFanpiaoRecords,
  }
}

export function useUserStats() {
  const { stats } = useState("user", ["stats"]);
  const { setStats } = useMutations("user", ["setStats"]);

  async function requestUserStats() {
    let res = await API.User.getUserSavingStats();
    setStats(res.stats);
  }

  return {
    stats,
    requestUserStats
  }
}

export function userMerchantInfo() {

  return {

  }
}

const PAGE = 1;
const SIZE = 100
export function useUserCoupon() {


  let usedCouponList = ref([]), expiredCouponList = ref([]);


  async function requestUsedCouponList() {
    let acceptData = {
      page: PAGE,
      size: SIZE,
      state: "USED",
    };
    let res = await API.User.getUserOwnCouponList(acceptData);

    return res || []
  }
  async function requestExpiredCouponList() {
    let acceptData = {
      page: PAGE,
      size: SIZE,
      state: "EXPIRED",
    };
    let res = await API.User.getUserOwnCouponList(acceptData);

    return res || []
  }


  return {
    usedCouponList,
    expiredCouponList,
    requestUsedCouponList,
    requestExpiredCouponList,
  }
}

// ?????????????????????????????????
export function useUserMerchantCoupon() {
  let { userMerchantCoupons } = useState('user', ["userMerchantCoupons"]);
  let { setUserMerchantCoupons } = useMutations('user', ["setUserMerchantCoupons"]);

  async function requestUserMerchantCoupons(merchantId) {
    let res = await API.User.getUserMerchantCoupon(merchantId)
    let coupons = res?.coupons || [];
    // let coupons = [];
    setUserMerchantCoupons(coupons || [])
    return coupons;

  }

  return {
    userMerchantCoupons,
    requestUserMerchantCoupons,
  }
}

// ??????????????????????????????
export function useUserPhone() {

  let { phone } = useState('user', ["phone"]);
  let { setPhone } = useMutations('user', ["setPhone"]);
  return {
    phone,
    setPhone
  }

}

// ????????????????????????(????????????)
export function useUserAddress() {

  const { userAddressList } = useState('user', ["userAddressList"]);
  const { setUserAddressList } = useMutations('user', ["setUserAddressList"]);

  async function requestUserAddressList() {
    let res = await API.User.getUserProfile();
    let addressList = res?.userInfo?.memberProfile?.shippingAddress || [];
    setUserAddressList(addressList)
    return addressList
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

export function useUserMerchantWallet() {
  let { userWallet } = useState('user', ["userWallet"]);
  let { setUserWallet } = useMutations('user', ["setUserWallet"]);

  async function requestUserWallet(merchantId) {

    let memberBalanceRes = await API.User.getUserMemberBalance(merchantId);
    setUserWallet({
      "memberCardBalance": memberBalanceRes.balance || 0,
    })
    let fanpiaoBalanceRes = await API.User.getUserFanpiaoBalance(merchantId);
    setUserWallet({
      "fanpiaoBalance": fanpiaoBalanceRes.balance || 0,
    })
    let userWalletRes = await API.User.getUserWallet();
    setUserWallet({
      "redPacketBalance": userWalletRes.balance || 0,
    })

    let res = await API.User.getUserFanpiaoPaidFee({
      merchantId,
      billFee: 10000 * 100,
      noDiscountFee: 0
    })

    setUserWallet({
      fanpiaoPaidFee: res?.paidFee || 0
    })

  }
  async function requestFanpiaoPaidFee(merchantId, orderId, billFee = 10000 * 100) {
    let res = await API.User.getOrderFanpiaoPaidFee({
      merchantId,
      fee: billFee,
      orderId,
    });

    return res;
  }

  return {
    userWallet,
    requestUserWallet,
    requestFanpiaoPaidFee
  }
}

export function useUserMerchantMemberBalance() {
  let { setUserWallet } = useMutations('user', ["setUserWallet"]);
  async function requestUserMerchantMemberBalance(merchantId) {
    API.User.getUserWallet().then(({ memberCardBalance }) => {
      memberCardBalance && setUserWallet({
        memberCardBalance: memberCardBalance || 0
      })
    });
  }
  return {
    requestUserMerchantMemberBalance
  }

}




export function useUserMerchantFanpiaoBalance() {

  let userMerchantFanpiaoBalance = ref(0), fanpiaoBalancePaidFee = ref(0);
  async function requestUserMerchantFanpiaoBalance(merchantId) {
    let res = await API.User.getUserFanpiaoBalance(merchantId);
    userMerchantFanpiaoBalance.value = res.balance;
  }

  async function requestFanpiaoBalancePaidFee(merchantId) {
    let billFee = 10000 * 100;
    let res = await API.User.getUserFanpiaoPaidFee({
      merchantId,
      billFee,
      noDiscountFee: 0
    });
    // ????????????????????????????????????
    fanpiaoBalancePaidFee.value = billFee - res.remainFee;
    // fanpiaoBalancePaidFee.value = 0;
    return res;
  }

  async function calcFanpiaoPaidBill(merchantId, billFee) {
    let res = await API.User.getUserFanpiaoPaidFee({
      merchantId,
      billFee,
      noDiscountFee: 0
    });
    return res;
  }



  return {
    userMerchantFanpiaoBalance,
    requestUserMerchantFanpiaoBalance,
    fanpiaoBalancePaidFee,
    requestFanpiaoBalancePaidFee,
    calcFanpiaoPaidBill

  }
}


export function useUserLogin() {

  async function checkLogin() {
    let userId = uni.getStorageSync('userId') || "";
    if (!userId) {
      navigateTo("MENU/LOGIN")
      return ''
    }
    return userId;
  }

  async function signUp() {
    //#ifdef MP-WEIXIN
    await wechatSignUp();
    //#endif

    //#ifdef MP-ALIPAY
    await aliSignUp();
    //#endif
  }

  return {
    checkLogin,
    signUp,
  }
}
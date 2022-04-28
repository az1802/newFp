/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:42
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 14:02:19
 * @FilePath: /new-fanpiao-uniapp/src/api/user.js
 */

import URLS from './urls'
import http from './http';

// let userIdMock = "d4848915-b103-4e1a-abfd-a04886fa61e6"
let userIdMock = ""

export async function setUserHeader(userId = userIdMock) {
  http.setHeaders({
    userId,
  })
}

export async function signUp(data) {
  let url = `${URLS.USER_SIGN_UP}`;
  let res = await http.post(url, data);
  return res;
}
export async function signUpAlipay(data) {
  let url = `${URLS.SIGN_UP_ALIPAY}`;
  let res = await http.post(url, data);
  return res;
}

export async function getUserMerchantInfo(merchantId) {
  let url = `${URLS.USER_MERCHANT_INFO}/${merchantId}`;
  let res = await http.get(url);
  // return {
  //   isPhoneMember: true,
  //   phone: "17688479248",
  //   phoneMemberDiscount: 10,
  //   userId: "d4848915-b103-4e1a-abfd-a04886fa61e6"
  // }
  return res;
}
export async function getUserFanpiaoBalance(merchantId) {
  let url = `${URLS.USER_FANPIAO_BALANCE}?merchantId=${merchantId}`; //TODO
  let res = await http.get(url);
  return res;
}
export async function getUserMemberBalance(merchantId) {
  let url = `${URLS.USER_MEMBER_BALANCE}/${merchantId}`;
  let res = await http.get(url);
  return res;
}
export async function getUserFanpiaoPaidFee(data) {
  let url = `${URLS.GET_USE_SHOW_PAID_FEE}`;
  let res = await http.post(url, data);
  return res;
}
export async function getOrderFanpiaoPaidFee(data) {
  let url = `${URLS.GET_ORDER_SHOW_PAID_FEE}`;
  let res = await http.post(url, data);
  return res;
}
export async function getUserInfo() {
  let url = `${URLS.USER_INFO}`;
  let res = await http.get(url);
  return res;
}
export async function updateUserInfo(args) {
  let url = `${URLS.UPDATE_USER_INFO}`;
  let res = await http.post(url, args);
  return res;
}
export async function getUserSavingStats() {
  let url = `${URLS.USER_SAVING_STATS}`;
  let res = await http.get(url);
  return res;
}
export async function getUserWallet() {
  let url = `${URLS.USER_WALLET}`;
  let res = await http.get(url);
  return res;
}
export async function getUserFanpiaoRecords() {
  let url = `${URLS.USER_FANPIAO_RECORDS}`;
  let res = await http.get(url);
  return res;
}
export async function getRedPaperList() {
  let url = `${URLS.USER_RED_PAPER_LIST}`;
  let res = await http.get(url);
  return res;
}
export async function withdraw(args) {
  let url = `${URLS.USER_WITHDRAW}`;
  let res = await http.post(url, args);
  return res;
}
export async function getUserOwnCouponList(params) {
  let url = `${URLS.USER_OWN_COUPON_LIST}`;
  let res = await http.get(url, { params: params });
  return res;
}
export async function getUserMerchantCoupon(merchantId) {
  let url = `${URLS.USER_MERCHANT_COUPON}/${merchantId}`;
  let res = await http.get(url);
  return res;
}
export async function getAliUserPhone(data) {
  const url = URLS.GET_ALI_USER_PHONE;
  let res = await http.post(url, data);
  return res;
}
export async function getUserPhone(data) {
  const url = URLS.GET_USER_PHONE;
  let res = await http.post(url, data);
  return res;
}
export async function getUserProfile() {
  let userId = uni.getStorageSync('userId')
  const url = `${URLS.GET_USER_PROFILE}/${userId}`
  let res = await http.get(url);
  return res;
}
export async function addShippingAddress(addressInfo) {
  const url = `${URLS.ADD_SHIPPING_ADDRESS}`
  let res = await http.post(url, addressInfo);
  if (res.errcode == 0) {
    return true
  } else {
    return false;
  }
}
export async function updateAddressDetail(addressInfo) {
  const url = `${URLS.UPDATE_SHIPPING_ADDRESS}/${addressInfo.id}`
  let res = await http.post(url, addressInfo);
  if (res.errcode == 0) {
    return true
  } else {
    return false;
  }
}
export async function getAddressDetail(id) {
  const url = `${URLS.SHIPPING_ADDRESS_DETAIL}/${id}`
  let res = await http.get(url);
  return res;
}

export async function getUserQrcode(data) {
  const url = URLS.GET_USER_QRCODE;
  let res = await http.post(url, data);
  return res;
}


export async function feedback(data) {
  const url = URLS.FEEDBACK
  let res = await http.post(url, data);
  return res;
}
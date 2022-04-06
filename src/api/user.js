/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:42
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 14:02:19
 * @FilePath: /new-fanpiao-uniapp/src/api/user.js
 */

import URLS from './urls'
import http from './http';
http.setHeaders({
  userId: "d4848915-b103-4e1a-abfd-a04886fa61e6"
})


export async function getUserMerchantInfo(merchantId) {
  let url = `${URLS.USER_MERCHANT_INFO}/${merchantId}`;
  let res = await http.get(url);
  return res;
}

export async function getUserFanpiaoBalance(merchantId) {
  let url = `${URLS.USER_FANPIAO_BALANCE}/${merchantId}`;
  let res = await http.get(url);
  return res;
}

export async function getUserMemberBalance(merchantId) {
  let url = `${URLS.USER_MEMBER_BALANCE}/${merchantId}`;
  let res = await http.get(url);
  return res;
}

export async function getUserInfo() {
  let url = `${URLS.USER_INFO}`;
  let res = await http.get(url);
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
  const url = `${URLS.USER_RED_PAPER_LIST}`
  let res = await http.get(url);
  return res;
}
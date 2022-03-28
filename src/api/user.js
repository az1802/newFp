/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:42
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 14:02:19
 * @FilePath: /new-fanpiao-uniapp/src/api/user.js
 */

import URLS from './urls'
import http from './http';

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

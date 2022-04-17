/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:34
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 14:00:32
 * @FilePath: /new-fanpiao-uniapp/src/api/merchant.js
 */
/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:34
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-11 16:23:05
 * @FilePath: /new-fanpiao-uniapp/src/api/merchant.js
 */
import URLS from './urls'
import http from './http';
import { reduceRight } from 'lodash';

// import catalogScene from '@mockData/catalogScene.js'
// import dishCategory from '@mockData/dishCategory.js'


export async function getMerchantInfo(merchantId) {
  let url = `${URLS.GET_MERCHANT_INFO}/${merchantId}`;
  let res = await http.get(url)
  return res;
}

export async function getDishCatalogScene(scene) {
  let url = `${URLS.DISH_CATALOG_SCENE}/${scene}`;
  let res = await http.get(url);
  return res;
}
export async function getOptions(params) {
  let url = `${URLS.MERCHANT_OPTIONS}}`;
  let res = await http.get(url, { params });
  return res;
}

export async function getMerchantDishCategory(merchantId) {
  let url = `${URLS.GET_MERCHANT_DISH_CATEGORY}/${merchantId}`;
  let res = await http.get(url);
  return res;
}
export async function getDishSoldNumber(merchantId) {
  let url = `${URLS.DISH_SOLD_NUMBER}/${merchantId}`;
  let res = await http.get(url);
  return res;
}
export async function getRecommendedDishes(merchantId) {
  let url = `${URLS.GET_RECOMMEND_DISHES}/${merchantId}`;
  let res = await http.get(url);
  return res;
}

export async function getFanpiaoList(merchantId) {
  let url = `${URLS.GET_FANPIAO_CATEGORIES}/${merchantId}`;
  let res = await http.get(url);
  return res;
}

export async function getCouponList(merchantId) {
  let url = `${URLS.GET_COUPON_PACKAGE}/${merchantId}`;
  let res = await http.get(url);
  return res;
}
export async function getFanpiaoPlatformRecords() {
  let url = `${URLS.FANPIAO_PLATFORM_RECORDS}`;
  let res = await http.get(url);
  return res;
}
export async function refundFanpiaoApply(args) {
  let url = `${URLS.USER_REFUND_FANPIAO_APPLY}`;
  let res = await http.post(url, args);
  return res;
}

export async function getFanpiaoTransactionDetail(merchantId, fanpiaoInfo) {
  let url = `${URLS.GET_FANPIAO_TRANSACTION_DETAIL}/${merchantId}`;
  let res = await http.get(url, { params: fanpiaoInfo });
  return res;
}

export async function getFanpiaoBuyRecord(merchantId, args) {
  let url = `${URLS.MERCHANT_FANPIAO_BUY_RECORD}/${merchantId}`;
  let res = await http.get(url, args)
  return res;
}
export async function getRechargeConfigs(merchantId, args) {
  let url = `${URLS.GET_RECHARGE_CONFIGS}/${merchantId}`;
  let res = await http.get(url, args)
  return res;
}
export async function getMpqrcodeTable(qrCodeId) {
  let url = `${URLS.MPQRCODE_TABLE}`;
  let res = await http.get(url, { data: { qrCodeId } })
  return res;
}
export async function getTableInfo(tableId) {
  let url = `${URLS.GET_TABLE_INFO}/${tableId}`;
  let res = await http.get(url)
  return res;
}

export async function getQrcodeInfo(scene) {
  let url = `${URLS.MERCHANT_QRCODE_INFO}/${scene}`;
  let res = await http.post(url)
  return res;
}

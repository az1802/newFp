/*
 * @Author: sunjie
 * @Date: 2022-02-08 14:46:34
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 11:54:29
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

import catalogScene from '@mockData/catalogScene.js'
import dishCategory from '@mockData/dishCategory.js'

http.setHeaders({
  userId: "d4848915-b103-4e1a-abfd-a04886fa61e6"
})


export async function getMerchantInfo(merchantId) {
  console.log('%cmerchantId: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', merchantId);
  let url = `${URLS.GET_MERCHANT_INFO}/${merchantId}`;
  let res = await http.get(url)
  return res;
}

export async function getDishCatalogScene(scene) {
  let url = URLS.DISH_CATALOG_SCENE + scene;
  let res = await http.get(url);
  return res;
}

export async function getMerchantDishCategory(merchantId) {
  let url = `${URLS.GET_MERCHANT_DISH_CATEGORY}/${merchantId}`;
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
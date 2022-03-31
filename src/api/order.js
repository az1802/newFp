/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:03:20
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:11:09
 * @FilePath: /new-fanpiao-uniapp/src/api/order.js
 */
import URLS from './urls'
import http from './http';
import { reduceRight } from 'lodash';


http.setHeaders({
  userId: "d4848915-b103-4e1a-abfd-a04886fa61e6"
})


export async function getOrderDetail(orderId) {
  let url = `${URLS.GET_COUPON_PACKAGE}/${orderId}`;
  let res = await http.get(url);
  return res;
}

export async function createOrder(merchantId, orderInfo) {
  let url = `${URLS.CREATE_ORDER}/${merchantId}`;
  let res = await http.post(url, orderInfo);
  return res;
}

export async function pay(args) {
  let url = URLS.PAYMENT_PREPAY
  let res = await http.post(url, args);
  console.log('%cargs: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', res);

  return res;
}
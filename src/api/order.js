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
  return res;
}

export async function getOrderDetailById(orderId) {
  let url = `${URLS.ORDER_DETAIL}/${orderId}`;
  let res = await http.get(url);
  return res;
}

export async function getOrderList() {
  let url = `${URLS.USER_ORDER_LIST}`;
  let res = await http.get(url);
  return res;
}
export async function getFanpiaoList() {
  let url = `${URLS.USER_FANPIAO_LIST}`;
  let res = await http.get(url);
  return res;
}
export async function getCouponList() {
  let url = `${URLS.USER_COUPON_LIST}`;
  let res = await http.get(url);
  return res;
}

export async function refundFanpiao(transactionId, args) {
  const url = URLS.USER_REFUND_FANPIAO + `${transactionId}`
  let res = await http.post(url, args);
  return res;
}

export async function refundCoupon(transactionId, args) {
  const url = URLS.USER_REFUND_COUPON + `${transactionId}`
  let res = await http.post(url, args);
  return res;
}

/*
 * @Author: sunjie
 * @Date: 2022-02-17 15:03:20
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 15:04:55
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
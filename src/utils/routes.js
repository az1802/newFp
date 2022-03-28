/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:29:32
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 15:00:18
 * @FilePath: /new-fanpiao-uniapp/src/utils/routes.js
 */
const ORDER = '/package-order';
const MENU = '/package-menu'


export default {
  "MENU": {
    "MENU": `${MENU}/menu`
  },
  "ORDER": {
    "CREATE_ORDER": `${ORDER}/create-order`,
    "PAY_ORDER": `${ORDER}/pay-order`
  }
}
/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:22
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:28:22
 * @FilePath: /new-fanpiao-uniapp/src/utils/alpay.js
 */
export async function aliPay({ tradeNO }) {
  return new Promise((resolve, reject) => {
    my.tradePay({
      tradeNO: tradeNO,
      success: (res) => {
        resolve(true)
      },
      fail: (err) => {
        reject(false)
      }
    });
  })
}
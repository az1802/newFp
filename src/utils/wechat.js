/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:18
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:28:18
 * @FilePath: /new-fanpiao-uniapp/src/utils/wechat.js
 */


export async function wechatPay(signData) {
  return new Promise((resolve, reject) => {
    const {
      timeStamp,
      nonceStr,
      package: Package,
      signType,
      paySign,
    } = signData;
    uni.requestPayment({
      timeStamp: String(timeStamp),
      nonceStr,
      package: Package,
      signType,
      paySign,
      success: (...rets) => {
        resolve(true)
      },
      fail: (err) => {
        if (err.errMsg !== "requestPayment:fail cancel") {
          resolve(false)
        } else {
          resolve(true)
        }
      }
    });
  })
}
/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:22
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:28:22
 * @FilePath: /new-fanpiao-uniapp/src/utils/alpay.js
 */
import API from "@api";
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




export async function getAliPhoneNumber() {
  return new Promise((resolve, reject) => {
    my.getPhoneNumber({
      success(res) {
        let response;
        if (res.response) {
          response = JSON.parse(res.response)
          API.User.getAliUserPhone({ resp: response }).then(phoneRes => {

            if (phoneRes && phoneRes.errcode == 0) {
              resolve({
                phone: phoneRes.data.mobile
              })
            } else {
              resolve(false)
            }
          }).catch(err => {
            resolve(false)
          })
        }
      },
      fail(res) {
        resolve(false)
      }
    })
  })
} 

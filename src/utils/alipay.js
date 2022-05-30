/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:22
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:28:22
 * @FilePath: /new-fanpiao-uniapp/src/utils/alpay.js
 */
import API from "@api";
export async function aliPay({ tradeNo }) {
  return new Promise((resolve, reject) => {
    my.tradePay({
      tradeNO: tradeNo,
      success: (res) => {
        resolve(res.resultCode == "9000")
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



export async function aliSignUp() {
  my.getAuthCode({
    scopes: "auth_base",
    success: async (res) => {
      await _signUpAlipay(res.authCode);
    },
    fail: (res) => { },
    complete: (res) => { },
  });
  return;
}
async function _signUpAlipay(authCode) {
  if (authCode.split('&').length > 1) {
    authCode = authCode.split('&')[0]
  }
  let data = { authCode: authCode, platform: "MINIPROGRAM", version: 1 };
  let res = await API.User.signUpAlipay(data);
  const { alipayProfile = {}, memberProfile, id } = res;
  if (id) {
    uni.setStorageSync("userId", id);
    API.User.setUserHeader(id)
  }
  return;
}
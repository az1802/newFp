/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:18
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:28:18
 * @FilePath: /new-fanpiao-uniapp/src/utils/wechat.js
 */
import API from '@api';

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
          resolve(false)
        }
      }
    });
  })
}


// 获取微信设置信息
export async function getSettingAsync() {
  let subSetting = await uni.getSetting({
    withSubscriptions: true,
  })
  return subSetting;
}

// 打开微信订阅设置
export async function openSettingAsync() {
  let setSettingRes = await uni.openSetting({
    withSubscriptions: true,
  });
  return setSettingRes;
}

// 发起微信订阅
export async function requestSubscribeMessageAsync(...tmplIds) {

  let subRes = await uni.requestSubscribeMessage({
    tmplIds: tmplIds,
  })
  return subRes;
}

// 判断微信订阅是否已经总是允许
export function judgeSubscriptionsSetting(subscriptionsSetting, tmplId) {
  if (subscriptionsSetting && subscriptionsSetting.mainSwitch === true && (subscriptionsSetting[tmplId] === "accept" || subscriptionsSetting.itemSettings && subscriptionsSetting.itemSettings[tmplId] == "accept")) {
    return true
  }
  return false
}


// 是否拒绝接受消息通知
export function isRejectSUb(subscriptionsSetting, tmplId) {
  if (!subscriptionsSetting) {
    return true
  }
  if (subscriptionsSetting.mainSwitch === false || (subscriptionsSetting[tmplId] === "reject" || subscriptionsSetting.itemSettings && subscriptionsSetting.itemSettings[tmplId] == "reject")) {
    return true
  }
  return false
}

// 添加订阅次数
export async function addSubCountAsync(tmplId) {
  let [getSettingErr, settingRes] = await getSettingAsync();
  if (judgeSubscriptionsSetting(settingRes.subscriptionsSetting, tmplId)) {
    let [subErr, subSuccess] = await requestSubscribeMessageAsync(tmplId);
    if (subErr) {
      console.log("tmplId-" + tmplId + "添加订阅次数失败", subErr)
    } else {
      console.log("tmplId-" + tmplId + "添加订阅次数", subSuccess)
    }
  } else {
    console.log("tmplId-" + tmplId + "未点击总是允许添加订阅次数失败")
  }
}

// 是否需要打开订阅设置
export function isOpenSetting(subscriptionsSetting, TMPL_ID) {
  if (!!subscriptionsSetting == false) {
    return false;
  }
  if (subscriptionsSetting.mainSwitch === false) {
    return true
  }
  if ((subscriptionsSetting[TMPL_ID] === "reject" || subscriptionsSetting.itemSettings && subscriptionsSetting.itemSettings[TMPL_ID] == "reject")) {
    return true
  }
  return false
}

export function getUserInfo() {
  //#ifdef MP-WEIXIN
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: "个人主页信息展示",
      complete(res) {
        console.log("complete", res);
        resolve(res)
      },
      success: (res) => {
        console.log("success", res);
        resolve(res);
      }, fail: (err) => { //获取个人信息失败
        console.log("err", err);
        resolve(false)
      }
    })
  });
  //#endif

  //#ifndef MP-WEIXIN
  return new Promise((resolve, reject) => {
    uni.getUserInfo({ success: resolve, fail: reject })
  })
  //#endif
}


export async function getWechatPhone(e) {
  let codeMsg = await uni.login();
  if (e.target.errMsg !== "getPhoneNumber:ok") {
    return false;
  }
  let data = {
    code: codeMsg.code,
    iv: e.target.iv,
    encryptedData: e.target.encryptedData,
  };
  let phoneRes = await API.User.getUserPhone(data);
  return phoneRes?.phone || false;
}

export async function chooseLocation() {
  let addressRes = {}
  let res = await uni.chooseLocation()
  //#ifdef MP-ALIPAY
  if (res && res.error == 11) {
    return;
  }
  const { provinceName, cityName, address, name, latitude, longitude } = res
  addressRes.street = provinceName + cityName + address + name
  addressRes.latitude = latitude
  addressRes.longitude = longitude
  //#endif

  //#ifndef MP-ALIPAY
  if (res.errMsg !== 'chooseLocation:ok') {
    return
  }
  const { name, address, latitude, longitude } = res
  addressRes.street = address + name
  addressRes.latitude = latitude
  addressRes.longitude = longitude
  //#endif


  return addressRes;
}

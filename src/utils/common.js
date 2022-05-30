/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:26
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:28
 * @FilePath: /new-fanpiao-uniapp/src/utils/common.js
 */

export function upperFirst(word) {
  if (!word) return word;
  return word.slice(0, 1).toUpperCase() + word.slice(1)
}


export function cloneDeep(obj) {
  let res = {};
  for (let key in obj) {
    if (typeof obj[key] == 'object') {
      res[key] = cloneDeep(obj[key])
    } else {
      res[key] = obj[key];
    }
  }

  return res
}
export function maxBy(arr, fn) {
  let maxVal = -1, maxItem;
  arr.forEach(item => {
    if (fn(item) > maxVal) {
      maxVal = fn(item);
      maxItem = item

    }
  })

  return maxItem || '';

}
export function minBy(arr, fn) {
  let minVal = 100, minItem;
  arr.forEach(item => {
    if (fn(item) < minVal) {
      minVal = fn(item);
      minItem = item;
    }
  })
  return minItem || '';
}


export async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function noop() {

}
export function stop(e) {

  return false;
}

export async function showToast(msg = '', icon = 'none', duration = 1500) {
  if (!msg) return;

  return new Promise((resolve, reject) => {
    uni.showToast({
      title: msg,
      icon,
      duration,
      success() {
        resolve(true);
      },
      fail() {
        resolve(false);
      }
    })
  })

}

export async function tipSuccess(msg = '', duration = 1500) {
  return new Promise((resolve, reject) => {
    uni.showToast({
      title: msg,
      image: '/static/icon-selected.svg',
      mask: true,
      duration: duration,
      success() {
        resolve(true);
      },
      fail() {
        resolve(false);
      }
    })
  })
}

export async function showConfirmModal(title = '', content = "") {
  return new Promise(resolve => {
    uni.showModal({
      title,
      content,
      icon: 'none',
      duration: 1500,
      success({ confirm, cancal }) {
        resolve(confirm);
      },
      fail() {
        resolve(false);
      }
    })
  })
}

export async function newShowConfirmModal({ title = '', content = '', cancaelText = '取消', confirmText = "确定" }) {
  return new Promise(resolve => {
    uni.showModal({
      title,
      content,
      cancaelText,
      confirmText,
      icon: 'none',
      duration: 1500,
      success({ confirm, cancal }) {
        resolve(confirm);
      },
      fail() {
        resolve(false);
      }
    })
  })
}


export async function copyInfo(msg) {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: String(msg),
      success() {
        showToast("已复制内容至剪切板")
      },
      fail() {
        showToast("复制内容至剪切板出错")
      }
    })
  })
}


export function handleQrcodeStr(qrcodeStr) {
  let res = {}
  if (qrcodeStr.indexOf("?") != -1) {
    let paramsStr = qrcodeStr.slice(qrcodeStr.indexOf("?") + 1);
    let valStrs = paramsStr.split("&");
    for (let i = 0; i < valStrs.length; i++) {
      let temp = valStrs[i].split("=");
      res[temp[0]] = temp[1];
    }
  }
  return res;
}


export function fenToYuan(price = 0) {
  return Math.abs(Number(parseFloat(price) / 100).toFixed(2));
}

export function yuanToFen(price) {
  return Number(price * 100);
}


export function throttle(fn, wait) {
  var isRun = false;
  return function () {
    var context = this;
    var args = arguments;
    if (!isRun) {
      isRun = true;
      setTimeout(() => {
        isRun = false;
      }, wait)
      fn.apply(context, args);
    }
  }
}



export const payMethodMap = {
  'WALLET': "时来钱包",
  'WECHAT_PAY': "微信支付",
  "ALIPAY": "支付宝支付",
  'SHILAI_MEMBER_CARD_PAY': "储值支付",
  'PHONE_MEMBER_PAY': "会员支付",
  'FANPIAO_PAY': "时来饭票",
  'TIAN_QUE_PAY': "微信支付",
}


export async function makePhoneCall(phone) {
  return new Promise((resolve, reject) => {
    uni.makePhoneCall({
      phoneNumber: phone,
      success() { resolve(true) },
      fail() {
        // showToast("唤起电话失败")
        reject(false)
      }
    })
  })
}

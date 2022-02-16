/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:27:43
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-09 14:39:23
 * @FilePath: /new-fanpiao-uniapp/src/utils/storage.js
 */
// 获取globalData内值,不存在则返回defaultVal值
export function getGlobalData(key, defaultVal) {
  return getApp().globalData[key] === undefined ? defaultVal : getApp().globalData[key];
}

// 设置全局globalData
export function setGlobalData(key, data) {
  getApp().globalData[key] = data;
}


export function setStorage(key, val) {
  uni.setStorageSync(key, val);
}

export function getStorage(key, val) {
  uni.getStorageSync(key);
}
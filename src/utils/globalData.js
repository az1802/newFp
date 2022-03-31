
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
  return uni.getStorageSync(key);
}
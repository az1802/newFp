/*
 * @Author: sunjie
 * @Date: 2022-02-09 14:28:26
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 17:57:05
 * @FilePath: /new-fanpiao-uniapp/src/utils/common.js
 */

export async function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

function isSkuDish(dish) {
  return (dish.attrList.length > 0 || dish.supplyCondiments.length > 0 || dish.childDishGroups.length > 0) || false;;
}


const CATEGORY_TITLE_HEIGHT = 50;
const DISH_ITEM_HEIGHT = 86 + 24

export function handleDishList(dishes) {

  let dishesMap = {};
  let dishSrollTops = [], categoryScrollTops = [], scrollTop = 0;

  // 更新菜品映射表
  dishes.forEach((categoryItem, index) => {
    categoryScrollTops.push(scrollTop);
    scrollTop += CATEGORY_TITLE_HEIGHT;
    categoryItem.dishList.forEach(dishItem => {
      dishItem.isSku = isSkuDish(dishItem)
      dishesMap[dishItem.id] = dishItem;
      scrollTop += DISH_ITEM_HEIGHT;
      dishSrollTops.push(scrollTop);
    })
  })
  categoryScrollTops.push(Number.MAX_SAFE_INTEGER)
  // 更新菜品滚动距离表



  getApp().globalData.dishMap = dishesMap;
  getApp().globalData.dishSrollTops = dishSrollTops;
  getApp().globalData.categoryScrollTops = categoryScrollTops;

  return dishes;
}



export function getDishInfoById(dishId) {
  let dishesMap = getApp().globalData.dishMap || {};
  return dishesMap[dishId] || "";
}


export function noop() {

}

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
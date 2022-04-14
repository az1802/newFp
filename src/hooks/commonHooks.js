/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:00
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 12:21:46
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/commonHooks.js
 */
import { computed, ref, reactive } from 'vue'
import { getDishInfoById, navigateTo, navigateBack, formatTme } from "@utils";
import { getDishCatalogScene, getMerchantInfo, getMerchantDishCategory } from "@api/merchant"
import { useState, useGetters, useMutations } from "@hooks/storeHooks";

export function useSystemInfo() {
  let systemInfo = getApp().globalData.systemInfo;
  // TODO 根据系统信息做二次处理
  return systemInfo;
}



export function useScrollViewScroll() {

  return {
    scrollFn(e) {

    }
  }
}


export function useTransformPrice() {

  function fenToYuan(price) {
    return Math.abs(Number(price / 100).toFixed(2));
  }

  function yuanToFen(price) {
    return Number(price * 100);
  }

  return {
    fenToYuan,
    yuanToFen
  }
}


export function useNavigate() {

  return {
    navigateTo,
    navigateBack
  }
}


export function useTabs(tabsArr = []) {

  let tabs = ref(tabsArr), curTabIndex = ref(0);


  function switchTab(index) {
    curTabIndex.value = index;
  }


  return {
    tabs,
    switchTab,
    curTabIndex

  }
}


export function useTimeTransform() {


  return {
    formatTme
  }
}


export function useModal() {
  let isShow = ref(false);
  return {
    isShow,
    showModal() {
      isShow.value = true;
    },
    hideModal() {
      console.log("关闭弹窗")
      isShow.value = false;
    },
    stop(e) {
      e.stopPropagation();
      return "";
    },
  }
}
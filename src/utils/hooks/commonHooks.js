/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:00
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:00:47
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/commonHooks.js
 */
import { computed, ref, reactive } from 'vue'
import { getDishInfoById } from "@utils/common.js";
import { getDishCatalogScene, getMerchantInfo, getMerchantDishCategory } from "@api/merchant"
import { useState, useGetters, useMutations } from "@utils/storeHooks";

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

export function userDishOperaton() {
  let store = useStore();




  return {

  }

}

export function useUserInfo() {

}



export function useCategoryActive() {
}


export function useDishList() {

}

export function useCouponInfo() {

}

export function useFanpiaoInfo() {

}

// 已选菜品的添加 删除  清空
export function useSelFoodOperation() {

}
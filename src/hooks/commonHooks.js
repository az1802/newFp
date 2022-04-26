/*
 * @Author: sunjie
 * @Date: 2022-02-16 17:58:00
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 12:21:46
 * @FilePath: /new-fanpiao-uniapp/src/utils/hooks/commonHooks.js
 */
import { computed, ref, reactive, unref } from 'vue'
import { getDishInfoById, navigateTo, navigateBack, formatTime } from "@utils";
import { getDishCatalogScene, getMerchantInfo, getMerchantDishCategory } from "@api/merchant"
import { useState, useGetters, useMutations } from "@hooks/storeHooks";

export function useSystemInfo() {
  let systemInfo = getApp().globalData.systemInfo;
  return systemInfo;
}

// TODO 菜单滚动的逻辑抽象为hooks
export function useScrollViewScroll() {

  return {
    scrollFn(e) {

    }
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

export function useModal() {
  let isShow = ref(false);
  return {
    isShow,
    showModal() {
      isShow.value = true;
    },
    hideModal() {
      isShow.value = false;
    },
    stop(e) {
      e.stopPropagation();
      return "";
    },
  }
}


export function useLayout() {

  const systemInfo = getApp().globalData.systemInfo;
  const { statusBarHeight, screenWidth } = systemInfo;
  const navHeight = parseFloat(statusBarHeight) + 44;
  const menuHeadrHeight = parseFloat(Number(screenWidth / 3).toFixed(0));

  const { merchantInfo, fanpiaoList } = useState('merchant', ["merchantInfo", "fanpiaoList"]);
  const { orderInfo } = useState('order', ["orderInfo"])

  const bannerHeight = computed(() => {
    const { bannerMode } = unref(merchantInfo);
    let showBanner = bannerMode !== "BANNER_NONE" && unref(fanpiaoList).length;
    return showBanner ? 100 : 0
  })
  const pendingOrderHeight = computed(() => {
    const { pendingOrderId } = unref(orderInfo);
    return pendingOrderId ? 44 : 0
  })
  const menuStyle = computed(() => {
    let h = navHeight + menuHeadrHeight + unref(bannerHeight) + unref(pendingOrderHeight);
    let menuHeight = `calc(100vh) - ${h}px`
    return {
      height: menuHeight
    }
  })


  return {
    menuStyle,
    bannerHeight

  }


}

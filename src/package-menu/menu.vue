<!--
 * @Author: sunjie
 * @Date: 2022-02-10 10:05:15
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 16:29:11
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/menu.vue
-->
<template>
  <div class="container">
    <MenuHeader />
    <div class="menu-wrapper" :style="menuWrapperStyle">
      <MenuList :dishList="dishList" />
    </div>
    <MenuBottom />
    <SkuModal />
    <CartModal />
  </div>
</template>
<script >
import { reactive, onBeforeMount, onMounted, ref } from "vue";
import MenuHeader from "./MenuHeader/MenuHeader.vue";
import MenuList from "./MenuList/MenuList.vue";
import SkuModal from "./SkuModal/SkuModal.vue";
import CartModal from "./CartModal/CartModal.vue";
import MenuBottom from "./MenuBottom/MenuBottom.vue";

import API from "@api";
const {
  getDishCatalogScene,
  getMerchantInfo,
  getMerchantDishCategory,
  getFanpiaoList,
  getCouponList,
} = API.Merchant;

import { sleep, handleDishList } from "@utils/common";
import { useMerchantInfo, useSystemInfo } from "@utils/commonHooks";
import { useState, useMutations } from "@utils/storeHooks";
export default {
  components: {
    MenuList,
    SkuModal,
    CartModal,
    MenuHeader,
    MenuBottom,
  },
  setup(props, context) {
    const scene = "5c77abcc369d408d96e61a3583022dcd";
    const merchantId = "4146f4810c74424b819d7fcfb84826e8";

    let dishList = reactive([]);
    let userInfo = reactive({});
    const { statusBarHeight, screenWidth } = useSystemInfo();
    const { setMerchantInfo, setFanpiaoList, setCouponList } = useMutations(
      "merchant",
      ["setMerchantInfo", "setFanpiaoList", "setCouponList"]
    );

    onBeforeMount(async () => {
      let tableInfo = await getDishCatalogScene(scene);
      let { merchantId } = tableInfo;
      let merchantInfo = await getMerchantInfo(merchantId);
      setMerchantInfo(merchantInfo);

      getMerchantDishCategory(merchantId).then((res) => {
        let dishListRes = handleDishList(res.dishes);
        dishList.push(...dishListRes);
      });
      getFanpiaoList(merchantId).then((fanpiaoList) =>
        setFanpiaoList(fanpiaoList)
      );
      getCouponList(merchantId).then((couponList) =>
        setCouponList(couponList.couponPackages)
      );

      // let res = await getMerchantDishCategory(merchantId);
      // let dishListRes = handleDishList(res.dishes);
      // dishList.push(...dishListRes);

      // let fanpiaoList = await getFanpiaoList(merchantId);
      // setFanpiaoList(fanpiaoList);

      // let couponList = await getCouponList(merchantId);
      // setCouponList(couponList.couponPackages);
    });

    let menuWrapperStyle = ref({
      height: `calc(100vh - 250px - ${screenWidth / 3}px)`,
    });

    return {
      dishList,
      userInfo,
      menuWrapperStyle,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";

.container {
  .box-size(100vw,100vh);
  display: flex;
  flex-direction: column;
  .header {
    height: 150px;
    flex-shrink: 0;
    background: #ccc;
  }
  .menu-wrapper {
    flex: 1;
    height: calc(100vh - 250px - 65px);
  }
}
</style>
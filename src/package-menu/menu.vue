<!--
 * @Author: sunjie
 * @Date: 2022-02-10 10:05:15
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 13:41:43
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

import { sleep, handleDishList, getStorage } from "@utils/common";
import { useSystemInfo } from "@hooks/commonHooks";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
} from "@hooks/merchantHooks";
import { useDish } from "@hooks/menuHooks";
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
    const { requestMerchantInfo } = useMerchantInfo();
    const { statusBarHeight, screenWidth } = useSystemInfo();
    const { requestFanpiaoList } = useFanpiaoInfo();
    const { requestCouponList } = useCouponInfo();
    const { resetSelDishes } = useDish();
    resetSelDishes(getStorage("selected-dishes") || []);

    onBeforeMount(async () => {
      let tableInfo = await getDishCatalogScene(scene);
      let { merchantId } = tableInfo;
      requestMerchantInfo(merchantId);
      getMerchantDishCategory(merchantId).then((res) => {
        let dishListRes = handleDishList(res.dishes);
        dishList.push(...dishListRes);
      });
      requestFanpiaoList(merchantId);
      requestCouponList(merchantId);
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
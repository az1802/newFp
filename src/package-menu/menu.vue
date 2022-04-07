<!--
 * @Author: sunjie
 * @Date: 2022-02-10 10:05:15
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 13:41:43
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/menu.vue
-->
<template>
  <div class="container">
    <NavigationBar title="" />
    <MenuHeader />
    <div class="menu-wrapper" :style="menuWrapperStyle">
      <MenuList :dishList="dishList" />
    </div>
    <MenuBottom />
    <SkuModal />
    <ChildSkuModal />
    <CartModal />
  </div>
</template>
<script >
import { reactive, onBeforeMount, onMounted, ref } from "vue";
import MenuHeader from "./MenuHeader/MenuHeader.vue";
import MenuList from "./MenuList/MenuList.vue";
import SkuModal from "./SkuModal/SkuModal.vue";
import ChildSkuModal from "./SkuModal/ChildSkuModal.vue";
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

import { sleep, handleDishList, getStorage } from "@utils";
import { useSystemInfo } from "@hooks/commonHooks";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
} from "@hooks/merchantHooks";
import { useDish } from "@hooks/menuHooks";

const sceneMock = "e162ac24e1a64dd783f8408741c910b1";
const merchantIdMock = "8ec573585d9645229fb01713e30a2a6d";
let scene, merchantId;
export default {
  components: {
    MenuList,
    SkuModal,
    CartModal,
    MenuHeader,
    MenuBottom,
  },
  onLoad(opts) {
    scene = opts.scene || sceneMock;
    merchantId = opts.merchantId || merchantIdMock;
  },
  setup(props, context) {
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
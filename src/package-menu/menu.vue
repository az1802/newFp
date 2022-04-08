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
    <ChildSkuDishModal />
    <CartModal />

    <OpenScreenFanpiaoModal />
    <ScanModal ref="scanModal" @scan="scanOk" />

    <OptionModal ref="optionModal" @selPeopleOk="selPeopleOk" />
  </div>
</template>
<script >
import { reactive, onBeforeMount, onMounted, ref } from "vue";
import MenuHeader from "./MenuHeader/MenuHeader.vue";
import MenuList from "./MenuList/MenuList.vue";
import SkuModal from "./SkuModal/SkuModal.vue";
import CartModal from "./CartModal/CartModal.vue";
import MenuBottom from "./MenuBottom/MenuBottom.vue";
import ChildSkuDishModal from "./SkuModal/ChildSkuDishModal.vue";
import OpenScreenFanpiaoModal from "./OpenScreenFanpiaoModal/OpenScreenFanpiaoModal.vue";
import ScanModal from "./ScanModal/ScanModal.vue";
import OptionModal from "./OptionModal/OptionModal.vue";

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
  useFanpiaoOpenScreen,
} from "@hooks/merchantHooks";
import { useDish } from "@hooks/menuHooks";

// const sceneMock = "5c0daef6ea47421c908047702b0a35a9";
// const merchantIdMock = "1e543376139b474e97d38d487fa9fbe8";
// 开发用正式环境
const sceneMock = "09e36b4cd1ea400ba772443f0d2a8747";
const merchantIdMock = "611e8d6b48e844a186d5ead5a8340ff0";

// const sceneMock = "e162ac24e1a64dd783f8408741c910b1";
// const merchantIdMock = "8ec573585d9645229fb01713e30a2a6d";
let scene, merchantId;
export default {
  components: {
    MenuList,
    SkuModal,
    CartModal,
    MenuHeader,
    MenuBottom,
    ChildSkuDishModal,
    OpenScreenFanpiaoModal,
    ScanModal,
    OptionModal,
  },
  onLoad(opts) {
    scene = opts.scene || sceneMock;
    merchantId = opts.merchantId || merchantIdMock;
  },
  setup(props, context) {
    let dishList = reactive([]);
    let userInfo = reactive({});
    let scanModal = ref(""),
      optionModal = ref("");
    const { requestMerchantInfo } = useMerchantInfo();
    const { statusBarHeight, screenWidth } = useSystemInfo();
    const { requestFanpiaoList } = useFanpiaoInfo();
    const { requestCouponList } = useCouponInfo();
    const { resetSelDishes } = useDish();
    const { toggleShowFanpiaoOpenScreenModal } = useFanpiaoOpenScreen();

    resetSelDishes(getStorage("selected-dishes") || []);

    async function _handleMerchantConfig() {
      let merchantInfo = await requestMerchantInfo(merchantId);
      let { splashMode, disableBuyFanpiao } = merchantInfo;
      if (
        (splashMode == "FANPIAO" || splashMode == "FANPIAO_SNAP_UP") &&
        !disableBuyFanpiao
      ) {
        // toggleShowFanpiaoOpenScreenModal(true);
      }

      if (0) {
        // console.log(scanModal);
        scanModal.value.show();
      }

      if (0) {
        //选择人数
        optionModal.value.show();
      }
    }

    function scanOk(...args) {
      //  TODO  选桌台之后的操作
    }
    function selPeopleOk(...args) {
      //  TODO  选择人数
    }

    onBeforeMount(async () => {
      let tableInfo = await getDishCatalogScene(scene);
      let { merchantId } = tableInfo;
      uni.setStorageSync("merchantId", merchantId);
      _handleMerchantConfig(merchantId);
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
      scanModal,
      optionModal,
      scanOk,
      selPeopleOk,
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
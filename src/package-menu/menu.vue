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
    <CodeExpiredModal ref="codeExpiredModal" />
    <DishDetailModal />
    <SplashModal ref="splashModal" />
  </div>
</template>
<script >
import { reactive, onBeforeMount, onMounted, ref, unref } from "vue";
import MenuHeader from "./MenuHeader/MenuHeader.vue";
import MenuList from "./MenuList/MenuList.vue";
import SkuModal from "./SkuModal/SkuModal.vue";
import CartModal from "./CartModal/CartModal.vue";
import MenuBottom from "./MenuBottom/MenuBottom.vue";
import ChildSkuDishModal from "./SkuModal/ChildSkuDishModal.vue";
import OpenScreenFanpiaoModal from "./OpenScreenFanpiaoModal/OpenScreenFanpiaoModal.vue";
import ScanModal from "./ScanModal/ScanModal.vue";
import OptionModal from "./OptionModal/OptionModal.vue";
import CodeExpiredModal from "./CodeExpiredModal/CodeExpiredModal.vue";
import DishDetailModal from "./DishDetailModal/DishDetailModal.vue";
import SplashModal from "./SplashModal/SplashModal.vue";
import API from "@api";

import { sleep, handleDishList, getStorage } from "@utils";
import { useSystemInfo, useNavigate } from "@hooks/commonHooks";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
  useFanpiaoOpenScreen,
} from "@hooks/merchantHooks";
import { useUserLogin, useUserCoupon } from "@hooks/userHooks";
import { useDish } from "@hooks/menuHooks";
import { useOrder } from "@hooks/orderHooks";
import { handleQrcodeParams } from "@utils";

let opts;

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
    CodeExpiredModal,
    DishDetailModal,
    SplashModal,
  },
  onLoad(options) {
    // opts = options;
  },
  setup(props, context) {
    let dishList = reactive([]);
    let userInfo = reactive({});
    let scanModal = ref(""),
      optionModal = ref(""),
      codeExpiredModal = ref(""),
      splashModal = ref("");
    const { requestMerchantInfo, requestMerchantDishes, merchantInfo } =
      useMerchantInfo();
    const { statusBarHeight, screenWidth } = useSystemInfo();
    const { requestFanpiaoList } = useFanpiaoInfo();
    const { requestCouponList } = useCouponInfo();
    const { resetSelDishes } = useDish();
    const { toggleShowFanpiaoOpenScreenModal } = useFanpiaoOpenScreen();
    const { checkLogin } = useUserLogin();
    const { requestUserMerchantCoupon } = useUserCoupon();
    const { orderInfo, setOrderInfo } = useOrder();

    async function _handleMerchantConfig() {
      let { splashMode, disableBuyFanpiao } = unref(merchantInfo);
      if (
        (splashMode == "FANPIAO" || splashMode == "FANPIAO_SNAP_UP") &&
        !disableBuyFanpiao
      ) {
        toggleShowFanpiaoOpenScreenModal(true);
      } else if (splashMode === "IMAGE" || splashMode === "MEMBER_RECHARGE") {
        splashModal.value.showModal();
      }

      // TODO 点击下单的时候扫码
      if (0) {
        //扫码桌台码
        scanModal.value.show();
      }

      if (0) {
        //选择人数
        optionModal.value.show();
      }

      if (0) {
        //二维码过期
        codeExpiredModal.value.show();
      }
    }

    function scanOk(...args) {
      //  TODO  选桌台之后的操作
    }
    function selPeopleOk(...args) {
      //  TODO  选择人数
    }

    async function loadSource(parseRes) {
      let { scene, tableId, tableName } = parseRes;
      if (!scene && tableId) {
        //只有tableId的情况
        setOrderInfo({ tableId, tableName });
        let res = await API.Merchant.getTableInfo(tableId);
        scene = res.data.id;
      }

      if (scene) {
        //通过scene获取桌台相关的配置信息
        let res = await API.Merchant.getDishCatalogScene(scene);
        parseRes = Object.assign({}, parseRes, res);
        setOrderInfo(res);
      }

      if (parseRes.merchantId) {
        //获取商户信息和菜单信息
        let merchantId = parseRes.merchantId;
        //获取菜品
        await requestMerchantInfo(merchantId);
        let dishListRes = await requestMerchantDishes(merchantId);
        dishList.push(...dishListRes);

        // 进入页面根据缓存重置选中菜
        resetSelDishes(getStorage(`selected-dishes-${merchantId}`) || []);
        // 请求资源
        requestFanpiaoList(merchantId);
        requestCouponList(merchantId);
        // requestUserMerchantCoupon(merchantId);
      }
    }

    async function prepareMerchantInfo() {
      // let userId = checkLogin();
      // if (!userId) {
      //   return;
      // }
      try {
        let parseRes = await handleQrcodeParams(opts); //处理二维码参数
        await loadSource(parseRes); //根据不同的解析结果加载不同的数据
      } catch (err) {
        console.log(
          "%cerr: ",
          "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
          err
        );
      }
    }

    onBeforeMount(async () => {
      // 处理参数
      await prepareMerchantInfo();

      // 根据商户配置处理不同逻辑
      _handleMerchantConfig();
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
      codeExpiredModal,
      splashModal,
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
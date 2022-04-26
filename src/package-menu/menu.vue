<!--
 * @Author: sunjie
 * @Date: 2022-02-10 10:05:15
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 13:41:43
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/menu.vue
-->
<template>
  <div class="container">
    <NavigationBar title="" showOrderIcon />
    <MenuHeader />
    <div class="menu-wrapper" :style="menuWrapperStyle">
      <MenuList :dishList="dishList" />
    </div>
    <!-- <MenuList :dishList="dishList" /> -->
    <MenuBottom />
    <SkuModal />
    <ChildSkuDishModal />
    <CartModal />
    <OpenScreenFanpiaoModal />

    <ScanModal @scan="scanOk" />
    <OptionModal @selPeopleOk="selPeopleOk" :tableName="orderInfo.tableName" />
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
import { useSystemInfo } from "@hooks/commonHooks";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
  useFanpiaoOpenScreen,
} from "@hooks/merchantHooks";
import {
  useUserLogin,
  useUserCoupon,
  useUserMerchantFanpiaoBalance,
  useUserInfo,
  useUserMerchantCoupon,
} from "@hooks/userHooks";
import { useDish, useScanModal, useOptionModal } from "@hooks/menuHooks";
import { useOrder } from "@hooks/orderHooks";
import { handleQrcodeParams, navigateTo, showToast } from "@utils";

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
    let userId = uni.getStorageSync("userId") || "";
    if (!userId) {
      navigateTo("MENU/LOGIN");
      return "";
    }
    opts = options;
  },
  setup(props, context) {
    let dishList = reactive([]);
    let userInfo = reactive({});
    let codeExpiredModal = ref(""),
      splashModal = ref("");
    const { requestMerchantInfo, requestMerchantDishes, merchantInfo } =
      useMerchantInfo();
    const { getUserMerchantInfo } = useUserInfo();
    const { statusBarHeight, screenWidth } = useSystemInfo();
    const { requestFanpiaoList } = useFanpiaoInfo();
    const { requestCouponList } = useCouponInfo();
    const { resetSelDishes } = useDish();
    const { toggleShowFanpiaoOpenScreenModal } = useFanpiaoOpenScreen();
    const { checkLogin } = useUserLogin();
    const { userMerchantFanpiaoBalance, requestUserMerchantFanpiaoBalance } =
      useUserMerchantFanpiaoBalance();
    const { orderInfo, setOrderInfo } = useOrder();
    const { showScanModal } = useScanModal();
    const { showOptionModal, toggleShowOptionModal } = useOptionModal();
    const { requestUserMerchantCoupons } = useUserMerchantCoupon();

    async function _handleMerchantConfig() {
      let { splashMode, disableBuyFanpiao, recentlyOrderId } =
        unref(merchantInfo);
      if (recentlyOrderId) {
        setOrderInfo({
          pendingOrderId: recentlyOrderId,
        });

        return;
      }
      if (
        (splashMode == "FANPIAO" || splashMode == "FANPIAO_SNAP_UP") &&
        !disableBuyFanpiao
      ) {
        toggleShowFanpiaoOpenScreenModal(true);
      } else if (splashMode === "IMAGE" || splashMode === "MEMBER_RECHARGE") {
        splashModal.value.showModal();
      }
      if (!unref(orderInfo).peopleCount) {
        toggleShowOptionModal(true);
        return;
      }
    }

    function scanOk(tableInfo) {
      opts = {
        ...opts,
        ...tableInfo,
      };

      setOrderInfo(tableInfo);
      // TODO 多人点餐;
    }
    function selPeopleOk(peopleCount) {
      setOrderInfo({
        peopleCount,
      });
    }

    async function loadSource(parseRes) {
      let { scene, tableId, tableName, merchantId } = parseRes;
      if (!scene && !merchantId) {
        showToast("二维码信息错误");
        return;
      }
      if (!scene && tableId) {
        //只有tableId的情况
        setOrderInfo({ tableId, tableName });
        let res = await API.Merchant.getTableInfo(tableId);
        scene = res.id;
      }

      if (scene) {
        //通过scene获取桌台相关的配置信息
        let res = await API.Merchant.getDishCatalogScene(scene);
        parseRes.merchantId = res.merchantId;
        parseRes.tableId = res.tableId || parseRes.tableId;
        parseRes.tableName = res.tableName || parseRes.tableName;
        parseRes.mealType = res.mealType;
        parseRes.peopleCount =
          parseRes.peopleCount || (res.mealType !== "EAT_IN" ? 0 : 1);
        parseRes.onlyForPay = res.onlyForPay;
        parseRes.isSelectTablePay = res.isSelectTablePay;
        parseRes = Object.assign({}, parseRes);
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
        requestUserMerchantFanpiaoBalance(merchantId); //获取饭票余额
        getUserMerchantInfo(merchantId); //获取该用户是否是商户的会员
        requestUserMerchantCoupons(merchantId);
      }
    }

    async function prepareMerchantInfo() {
      let userId = checkLogin();
      if (!userId) {
        return;
      }
      try {
        let parseRes = await handleQrcodeParams(); //处理二维码参数
        if (parseRes.codeExpiredModal) {
          //二维码过期
          codeExpiredModal.value.show();
          return;
        }
        await loadSource(parseRes); //根据不同的解析结果加载不同的数据
      } catch (err) {
        console.log(err);
      }
    }

    onBeforeMount(async () => {
      // 处理参数
      await prepareMerchantInfo();

      // TODO 处理selectTable以及recentOrderId  强制收取手机号的配置处理
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
      codeExpiredModal,
      splashModal,
      scanOk,
      selPeopleOk,
      showScanModal,
      showOptionModal,
      orderInfo,
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
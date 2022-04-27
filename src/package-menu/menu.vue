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
    <div class="menu-wrapper" :style="menuStyle">
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
    <AddOrder />
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
import AddOrder from "./AddOrder/AddOrder.vue";
import API from "@api";

import { useSystemInfo, useLayout } from "@hooks/commonHooks";
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
import {
  useDish,
  useScanModal,
  useOptionModal,
  useResetModal,
} from "@hooks/menuHooks";
import { useOrder } from "@hooks/orderHooks";
import {
  handleQrcodeParams,
  navigateTo,
  showToast,
  handleDishList,
  sleep,
  getStorage,
  reLaunch,
} from "@utils";

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
    AddOrder,
  },
  onLoad(options) {
    let userId = uni.getStorageSync("userId") || "";
    if (!userId) {
      navigateTo("MENU/LOGIN", {
        from: "MENU/MENU",
        params: options,
      });
      return "";
    }
    opts = options;
  },
  async onShow() {
    // 当支付成功返回的时候需要重新请求用户相关的信息
    let resetUserMerchantInfo = getApp().globalData.resetUserMerchantInfo;
    if (resetUserMerchantInfo) {
      getApp().globalData.resetUserMerchantInfo = false;
      await this.resetUserMerchantInfo();
    }
  },
  setup(props, context) {
    let dishList = reactive([]);
    let userInfo = reactive({});
    let codeExpiredModal = ref(""),
      splashModal = ref("");
    const { resetDishModal } = useResetModal();

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
    const { menuStyle } = useLayout();

    async function _handleMerchantConfig() {
      let { splashMode, disableBuyFanpiao, recentlyOrderId } =
        unref(merchantInfo);
      if (recentlyOrderId) {
        setOrderInfo({
          pendingOrderId: recentlyOrderId,
        });
        if (!getApp().globalData.hasJumpedToCreateOrder) {
          //跳转到下单页面
          navigateTo("ORDER/CREATE_ORDER", {
            pendingOrderId: recentlyOrderId,
          });
        }
        return;
      }

      if (
        (splashMode == "FANPIAO" || splashMode == "FANPIAO_SNAP_UP") &&
        !disableBuyFanpiao &&
        unref(userMerchantFanpiaoBalance) < 5000
      ) {
        toggleShowFanpiaoOpenScreenModal(true);
      } else if (splashMode === "IMAGE" || splashMode === "MEMBER_RECHARGE") {
        splashModal.value.showModal();
      }
      if (!unref(merchantInfo).disablePeopleCount) {
        //业务主助手控制是否选择人数
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
        await requestUserMerchantCoupons(merchantId);
        await requestUserMerchantFanpiaoBalance(merchantId); //获取饭票余额
        await getUserMerchantInfo(merchantId); //获取该用户是否是商户的会员
      }
    }

    async function prepareMerchantInfo() {
      let userId = checkLogin();
      if (!userId) {
        return;
      }
      try {
        let parseRes = await handleQrcodeParams(opts); //处理二维码参数
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
      resetDishModal();
      // TODO 处理selectTable以及recentOrderId  强制收取手机号的配置处理
      // 根据商户配置处理不同逻辑
      _handleMerchantConfig();
    });

    async function resetUserMerchantInfo() {
      let { merchantId } = unref(merchantInfo);
      console.log("重新请求用户和商户相关的信息");
      await requestUserMerchantCoupons(merchantId);
      await requestUserMerchantFanpiaoBalance(merchantId); //获取饭票余额
      await getUserMerchantInfo(merchantId); //获取该用户是否是商户的会员
    }

    return {
      dishList,
      userInfo,
      menuStyle,
      codeExpiredModal,
      splashModal,
      scanOk,
      selPeopleOk,
      showScanModal,
      showOptionModal,
      orderInfo,
      resetUserMerchantInfo,
      resetDishModal,
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
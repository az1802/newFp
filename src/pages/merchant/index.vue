<template>
  <div class="page">
    <!-- #ifndef MP-ALIPAY -->
    <NavigationBar title="" position="fixed" />
    <!-- #endif -->
    <img
      :src="merchantInfo.storeCoverPhotoUrls"
      class="cover-photo"
      mode="aspectFill"
    />
    <HomeHeader :merchantInfo="merchantInfo" />
    <MealTypes
      :merchantInfo="merchantInfo"
      :enableOrderingService="merchantInfo.enableOrderingService"
      @mealTypeClick="goToMenu"
    />
    <RecommendDish :dishList="merchantInfo.recommendedFoodPhotoUrls" />
    <HomeCouponList
      :merchantId="merchantInfo.merchantId"
      :couponList="couponList"
      :disableShowCouponPackagePurchaseNumber="
        merchantInfo.disableShowCouponPackagePurchaseNumber
      "
    />
    <HomeFanpiaoList
      :merchantId="merchantInfo.merchantId"
      :fanpiaoList="fanpiaoList"
      :fanpiaoSalesBoostFactor="merchantInfo.fanpiaoSalesBoostFactor"
      :disableShowFanpiaoPurchaseNumber="
        merchantInfo.disableShowFanpiaoPurchaseNumber
      "
    />
    <div style="height: 100px"></div>
  </div>
</template>
<script>
import {
  useMerchantInfo,
  useCouponInfo,
  useFanpiaoInfo,
} from "@hooks/merchantHooks";
// import HomeHeader from "./HomeHeader/HomeHeader.vue";
// import MealTypes from "./MealTypes/MealTypes.vue";
// import RecommendDish from "./RecommendDish/RecommendDish.vue";
// import HomeCouponList from "./HomeCouponList/HomeCouponList.vue";
// import HomeFanpiaoList from "./HomeFanpiaoList/HomeFanpiaoList.vue";

import { ref, onBeforeMount, watch, unref } from "vue";
import { handleQrcodeStr, navigateTo, parseQrcodeParams } from "@utils";
import API from "@api";
let merchantId = "",
  scene = "",
  // ownTableId = "", //用于首页跳转到不同桌台
  tableId = "",
  tableName = "",
  mealType = "",
  opts = {};

export default {
  components: {
    // HomeHeader,
    // MealTypes,
    // RecommendDish,
    // HomeCouponList,
    // HomeFanpiaoList,
  },
  onLoad(options) {
    opts = options;
    // // 二合一码参数解析
    let parseRes = parseQrcodeParams(options.q);
    if (parseRes.scene || parseRes.merchantId) {
      merchantId = parseRes.scene || parseRes.merchantId;
    }

    if (options.merchantId) {
      merchantId = options.merchantId;
    }

    if (options.scene) {
      scene = options.scene;
    }
  },
  setup() {
    const { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    const { couponList, requestCouponList } = useCouponInfo();
    const { fanpiaoList, requestFanpiaoList } = useFanpiaoInfo();

    onBeforeMount(async () => {
      if (scene) {
        //根据scene值获取商户信息
        let res = await API.Merchant.getDishCatalogScene(scene);
        tableId = res.tableId;
        tableName = res.tableName;
        mealType = res.mealType;
        merchantId = res.merchantId;

        if (!tableId && !merchantId) {
          let res = API.Merchant.getOptions({ code: scene });
          merchantId = res.merchantId;
        }
      }

      requestMerchantInfo(merchantId);
      requestCouponList(merchantId);
      requestFanpiaoList(merchantId);
    });

    function goToMenu(mealType) {
      let userId = uni.getStorageSync("userId") || "";
      if (!userId) {
        navigateTo("MENU/LOGIN", {
          from: "MERCHANT/HOME",
          params: JSON.stringify(opts),
        });
        return "";
      }
      if (
        !unref(merchantInfo).opening &&
        (mealType === "SELF_PICK_UP" || mealType === "TAKE_OUT")
      ) {
        return;
      }
      let menuParams = {
        merchantId,
      };
      if (mealType == "EAT_IN") {
        menuParams.tableId = tableId;
        menuParams.tableName = tableName;
      }
      if (unref(merchantInfo).enableOrderingService) {
        menuParams.peopleCount = 1;
        menuParams.mealType = mealType;
        navigateTo("MENU/MENU", menuParams);
      }
    }

    return {
      merchantInfo,
      couponList,
      fanpiaoList,
      goToMenu,
    };
  },
  onShareAppMessage() {
    return {
      title: this.merchantInfo.name,
      imageUrl: this.merchantInfo.logoUrl,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.page {
  background: #f8f8f8;
  min-height: 100vh;
  .cover-photo {
    .box-size(100vw,calc(100vw/3));
  }
}
</style>
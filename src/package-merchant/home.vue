<template>
  <div class="page">
    <NavigationBar title="" position="fixed" />
    <img
      :src="merchantInfo.storeCoverPhotoUrls"
      class="cover-photo"
      mode="aspectFill"
    />
    <HomeHeader :merchantInfo="merchantInfo" />
    <MealTypes
      :merchantInfo="merchantInfo"
      :enableOrderingService="enableOrderingService"
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
  </div>
</template>
<script>
import { useNavigate } from "@hooks/commonHooks";
import {
  useMerchantInfo,
  useCouponInfo,
  useFanpiaoInfo,
} from "@hooks/merchantHooks";
import HomeHeader from "./HomeHeader/HomeHeader.vue";
import MealTypes from "./MealTypes/MealTypes.vue";
import RecommendDish from "./RecommendDish/RecommendDish.vue";
import HomeCouponList from "./HomeCouponList/HomeCouponList.vue";
import HomeFanpiaoList from "./HomeFanpiaoList/HomeFanpiaoList.vue";

import { ref, onBeforeMount, watch } from "vue";
import { handleQrcodeStr } from "@utils";

let merchantId = "",
  scene = "",
  ownTableId = "",
  enableOrderingService = false;

export default {
  components: {
    HomeHeader,
    MealTypes,
    RecommendDish,
    HomeCouponList,
    HomeFanpiaoList,
  },
  onLoad(opts) {
    console.log(
      "%copts: ",
      "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
      opts
    );
    merchantId = opts.merchantId || "1e543376139b474e97d38d487fa9fbe8";
    // // 二合一码参数解析
    // if (option.q) {
    //   let queryParams = handleQrcodeStr(decodeURIComponent(option.q));
    //   ownTableId = queryParams.id;
    //   merchantId = queryParams.merchantId;
    // }
    // //#ifdef MP-ALIPAY
    // let qrCodeJson = my.getStorageSync({ key: "qrCode" }).data;
    // if (qrCodeJson) {
    //   ownTableId = qrCodeJson.id;
    //   merchantId = qrCodeJson.merchantId;
    //   // 清除扫码留下的内容避免后续订单进入仍显示这家店铺
    //   my.setStorageSync({
    //     key: "qrCode",
    //     data: "",
    //   });
    // }
    // //#endif

    // if (opts.merchantId) {
    //   merchantId = opts.merchantId;
    //   enableOrderingService = opts.enableOrderingService == "true";
    // }

    // if (opts.scene) {
    //   scene = opts.scene;
    // }
  },
  setup() {
    const { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    const { couponList, requestCouponList } = useCouponInfo();
    const { fanpiaoList, requestFanpiaoList } = useFanpiaoInfo();

    onBeforeMount(async () => {
      requestMerchantInfo(merchantId);
      requestCouponList(merchantId);
      requestFanpiaoList(merchantId);
    });

    return {
      merchantInfo,
      enableOrderingService,
      couponList,
      fanpiaoList,
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